import React, { Component } from 'react'
import I18N from '@/I18N'
import _ from 'lodash'
import PopoverProfile from '@/module/common/PopoverProfile'
import moment from 'moment/moment'
import { Col, message } from 'antd'
import { Item, ItemTitle, ItemText, CopyButton } from './style'

class Preamble extends Component {
  copyToClip(content) {
    var aux = document.createElement('input')
    aux.setAttribute('value', content)
    document.body.appendChild(aux)
    aux.select()
    const err = document.execCommand('copy')
    document.body.removeChild(aux)
    if (err) {
      message.success(I18N.get('btn.CopyHash'))
    }
  }

  renderPreambleItem(header, value, item) {
    let text = <ItemText>{value}</ItemText>
    let btn = null
    const {
      detail: { createdBy },
      user
    } = this.props
    if (item === 'username') {
      text = <PopoverProfile owner={createdBy} curUser={user} />
    }
    if (item === 'txHash') {
      text = <a href={`https://blockchain.elastos.org/tx/${value}`}>{value}</a>
    }
    if (item === 'proposalHash') {
      btn = (
        <CopyButton onClick={() => this.copyToClip(value)}>
          {I18N.get('suggestion.btn.copyHash')}
        </CopyButton>
      )
    }
    return (
      <Item>
        <Col span={6}>
          <ItemTitle>{header}</ItemTitle>
        </Col>
        <Col span={18} style={{ wordBreak: 'break-all' }}>
          {text}
          {btn}
        </Col>
      </Item>
    )
  }

  render() {
    const { detail } = this.props
    return (
      <div>
        {detail.displayId &&
          this.renderPreambleItem(
            I18N.get('suggestion.fields.preambleSub.suggestion'),
            `#${detail.displayId}`
          )}
        {this.renderPreambleItem(
          I18N.get('suggestion.fields.preambleSub.title'),
          detail.title
        )}
        {detail.createdBy &&
          detail.createdBy.username &&
          this.renderPreambleItem(
            I18N.get('suggestion.fields.preambleSub.creator'),
            detail.createdBy.username,
            'username'
          )}
        {this.renderPreambleItem(
          I18N.get('suggestion.fields.preambleSub.status'),
          status
        )}
        {this.renderPreambleItem(
          I18N.get('suggestion.fields.preambleSub.created'),
          moment(detail.createdAt).format('MMM D, YYYY')
        )}
        {_.get(detail, 'signature.data') &&
          this.renderPreambleItem(
            I18N.get('suggestion.fields.preambleSub.signature'),
            detail.signature.data,
            'signature'
          )}
        {_.get(detail, 'reference.0.txHash') &&
          this.renderPreambleItem(
            I18N.get('suggestion.fields.preambleSub.txHash'),
            _.get(detail, 'reference.0.txHash'),
            'txHash'
          )}
        {_.get(detail, 'reference.0.proposalHash') &&
          this.renderPreambleItem(
            I18N.get('suggestion.fields.preambleSub.proposalHash'),
            _.get(detail, 'reference.0.proposalHash'),
            'proposalHash'
          )}
      </div>
    )
  }
}

export default Preamble
