import Base from './Base';
import { Document } from 'mongoose';
import * as _ from 'lodash';
import { constant } from '../constant';
import { permissions } from '../utility';
import * as moment from 'moment';

let tm = null;

const restrictedFields = {
  update: [
    '_id',
    'createdBy',
    'createdAt'
  ]
}

export default class extends Base {

    public async create(param): Promise<Document>{
        const db_cvote = this.getDBModel('CVote');
        const db_user = this.getDBModel('User');
        const currentUserId = _.get(this.currentUser, '_id')
        const {
            title, type, content, published, proposedBy, motionId, isConflict, notes,
        } = param;

        const councilMembers = await db_user.find({role: constant.USER_ROLE.COUNCIL});
        const voteResult = []
        _.each(councilMembers, user => {
          // use ObjectId.equals
          const value = currentUserId.equals(user._id) ? constant.CVOTE_RESULT.SUPPORT : constant.CVOTE_RESULT.UNDECIDED
          voteResult.push({ votedBy: user._id, value })
        })

        const doc: any = {
            title,
            type,
            published,
            content,
            proposedBy,
            motionId,
            isConflict,
            notes,
            voteResult,
            voteHistory: voteResult,
            createdBy : this.currentUser._id
        };

        const vid = await this.getNewVid();
        doc.vid = vid;
        doc.status = published ? constant.CVOTE_STATUS.PROPOSED : constant.CVOTE_STATUS.DRAFT;

        return await db_cvote.save(doc);
    }

    const recVariables = _.zipObject(toMails, _.map(users, (user) => {
      return {
        _id: user._id,
        username: formatUsername(user)
      }
    }))

    const mailObj = {
      to: toMails,
      // toName: ownerToName,
      subject: `New Proposal: ${title}`,
      body,
      recVariables,
    }
    console.log(mailObj, '====mailObj')
    mail.send(mailObj)
  }

  /**
   * List proposals, only an admin may request and view private records
   *
   * We expect the front-end to always call with {published: true}
   *
   * TODO: what's the rest way of encoding multiple values for a field?
   *
   * Instead of magic params, we should have just different endpoints I think,
   * this method should be as dumb as possible
   *
   * @param query
   * @returns {Promise<"mongoose".Document>}
   */
  public async list(param): Promise<Document> {

    const db_cvote = this.getDBModel('CVote');
    const db_user = this.getDBModel('User');
    const query: any = {};

    if (!param.published) {
      if (!this.isLoggedIn() || !this.canManageProposal()) {
        throw 'cvoteservice.list - unpublished proposals only visible to council/secretary';
      } else {
        // only owner can list his own proposal
        query.$or = [
          { createdBy: _.get(this.currentUser, '_id'), published: false },
          { published: true },
        ]
      }
    } else {
      query.published = param.published
    }

    const list = await db_cvote.list(query, {
      createdAt: -1
    }, 100);

    for (const item of list) {
      if (item.createdBy) {
        const u = await db_user.findOne({ _id: item.createdBy });
        item.createdBy = u.username;
      }

    }

    return list;
  }

  /**
   *
   * @param param
   * @returns {Promise<"mongoose".Document>}
   */
  public async update(param): Promise<Document> {
    const db_cvote = this.getDBModel('CVote');
    const { _id, published, notes, content, isConflict, proposedBy, title, type } = param

    if (!this.currentUser || !this.currentUser._id) {
      throw 'cvoteservice.update - invalid current user';
    }

    if (!this.canManageProposal()) {
      throw 'cvoteservice.update - not council'
    }

    const cur = await db_cvote.findOne({ _id });
    if (!cur) {
      throw 'cvoteservice.update - invalid proposal id';
    }

    const doc: any = {}

    if (content) doc.content = content
    if (isConflict) doc.isConflict = isConflict
    if (proposedBy) doc.proposedBy = proposedBy
    if (title) doc.title = title
    if (type) doc.type = type

    if (published === true && cur.status === constant.CVOTE_STATUS.DRAFT) {
      doc.status = constant.CVOTE_STATUS.PROPOSED
      doc.published = published
    }

    // always allow secretary to edit notes
    if (notes) doc.notes = notes

    await db_cvote.update({ _id }, doc);

    return await this.getById(_id);
  }

  public async finishById(id): Promise<any> {
    const db_cvote = this.getDBModel('CVote');
    const cur = await db_cvote.findOne({ _id: id });
    if (!cur) {
      throw 'invalid proposal id';
    }
    if (!this.canManageProposal()) {
      throw 'cvoteservice.finishById - not council'
    }
    if (_.includes([constant.CVOTE_STATUS.FINAL], cur.status)) {
      throw 'proposal already completed.';
    }

    const rs = await db_cvote.update({ _id: id }, {
      $set: {
        status: constant.CVOTE_STATUS.FINAL
      }
    })

    return rs;
  }

  public async getById(id): Promise<any> {
    const db_cvote = this.getDBModel('CVote')
    const rs = await db_cvote.getDBInstance().findOne({ _id: id })
      .populate('voteResult.votedBy', constant.DB_SELECTED_FIELDS.USER.NAME_AVATAR)
    return rs;
  }

  public async getNewVid() {
    const db_cvote = this.getDBModel('CVote');
    const n = await db_cvote.count({});
    return n + 1;
  }

  public isExpired(data): Boolean {
    const ct = moment(data.createdAt).valueOf();
    if (Date.now() - ct > constant.CVOTE_EXPIRATION) {
      return true;
    }
    return false;
  }

  // proposal active/passed
  public isActive(data): Boolean {
    const supportNum = _.countBy(data.voteResult, 'value').support || 0
    return supportNum > data.voteResult.length * 0.5;
  }

  public async vote(param): Promise<Document> {
    const db_cvote = this.getDBModel('CVote')
    const { _id, value, reason } = param
    const cur = await db_cvote.findOne({ _id })
    const votedBy = _.get(this.currentUser, '_id')
    if (!cur) {
      throw 'invalid proposal id';
    }

    await db_cvote.update(
      {
        _id,
        'voteResult.votedBy': votedBy
      },
      {
        $set: {
          'voteResult.$.value': value,
          'voteResult.$.reason': reason || '',
        },
        $push: {
          voteHistory: {
            value,
            reason,
            votedBy,
          }
        }
      }
    )

    return await this.getById(_id);
  }

  public async updateNote(param): Promise<Document> {
    const db_cvote = this.getDBModel('CVote');
    const { _id, notes } = param

    const cur = await db_cvote.findOne({ _id });
    if (!cur) {
      throw 'invalid proposal id';
    }
    if (!this.canManageProposal()) {
      throw 'cvoteservice.updateNote - not council'
    }
    if (this.currentUser.role !== constant.USER_ROLE.SECRETARY) {
      throw 'only secretary could update notes';
    }

    const rs = await db_cvote.update({ _id }, {
      $set: {
        notes: notes || ''
      }
    })

    return await this.getById(_id);
  }

  private async eachJob() {
    const db_cvote = this.getDBModel('CVote');
    const list = await db_cvote.find({
      status: constant.CVOTE_STATUS.PROPOSED
    });
    const idsDeferred = [];
    const idsActive = [];

    _.each(list, (item) => {
      if (this.isExpired(item)) {
        if (this.isActive(item)) {
          idsActive.push(item._id);
        } else {
          idsDeferred.push(item._id);
        }
      }
    });

    await db_cvote.update({
      _id: {
        $in: idsDeferred
      }
    }, {
        status: constant.CVOTE_STATUS.DEFERRED
      });
    await db_cvote.update({
      _id: {
        $in: idsActive
      }
    }, {
        status: constant.CVOTE_STATUS.ACTIVE
      });
  }

  public cronjob() {
    if (tm) {
      return false;
    }
    tm = setInterval(() => {
      console.log('---------------- start cvote cronjob -------------');
      this.eachJob();
    }, 1000 * 60);
  }

  private canManageProposal() {
    const userRole = _.get(this.currentUser, 'role')
    return permissions.isCouncil(userRole) || permissions.isSecretary(userRole)
  }
}
