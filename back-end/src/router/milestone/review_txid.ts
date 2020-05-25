import Base from '../Base'
import MilestoneService from '../../service/MilestoneService'

export default class extends Base {
  protected needLogin = true
  async action() {
    const param = this.getParam()
    const service = this.buildService(MilestoneService)
    const rs = await service.checkReviewTxid(param)
    return this.result(1, rs)
  }
}
