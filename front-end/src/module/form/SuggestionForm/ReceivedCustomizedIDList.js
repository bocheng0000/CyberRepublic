import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Select, Icon, Tag } from 'antd'
import I18N from '@/I18N'

class ReceivedCustomizedIDList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      customizedIDList: props.initialValue ? props.initialValue : []
    }
  }

  componentDidMount = async () => {
    const { getCustomizedIDList } = this.props
    const rs = await getCustomizedIDList()
    if (rs && rs.success) {
      const options = rs.didNameList.trim().split(/\s+/)
      const sortedOptions = options.sort((a, b) => {
        if (a < b) {
          return -1
        }
        if (a > b) {
          return 1
        }
        return 0
      })
      this.setState({ data: sortedOptions })
    }
  }

  handleClose = (value) => {
    const { customizedIDList } = this.state
    const { callback, onChange } = this.props
    const names = customizedIDList.filter((name) => name !== value)
    this.setState({ customizedIDList: names })
    onChange(names)
    callback('receivedCustomizedIDList')
  }

  handleChange = (value) => {
    const { customizedIDList } = this.state
    const { callback, onChange } = this.props
    const name = customizedIDList.find((name) => name === value)
    if (!name) {
      this.setState({ customizedIDList: [...customizedIDList, value] })
      onChange([...customizedIDList, value])
      callback('receivedCustomizedIDList')
    }
  }

  render() {
    const { customizedIDList, data } = this.state

    const options = data.map((name) => (
      <Select.Option key={name}>{name}</Select.Option>
    ))

    return (
      <Wrapper>
        <StyledDiv>
          <Select
            showSearch
            showArrow={true}
            size="large"
            filterOption={false}
            onChange={this.handleChange}
            suffixIcon={<Icon type="search" spin={false} />}
            defaultActiveFirstOption={false}
            placeholder={'search Customized DID'}
            notFoundContent={null}
            defaultOpen={false}
            style={{ fontSize: 14 }}
          >
            {options}
          </Select>
        </StyledDiv>

        <Tags>
          <div>You have selected: </div>
          {customizedIDList.length
            ? customizedIDList.map((tag) => (
                <Tag
                  closable
                  onClose={(e) => {
                    e.preventDefault()
                    this.handleClose(tag)
                  }}
                  key={tag}
                  style={{ backgroundColor: '#e7f5f2', border: 'none' }}
                >
                  {tag}
                </Tag>
              ))
            : null}
        </Tags>
      </Wrapper>
    )
  }
}

ReceivedCustomizedIDList.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func,
  initialValue: PropTypes.array
}

export default ReceivedCustomizedIDList

const Wrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
  gap: 36px;
`
const StyledDiv = styled.div`
  max-width: 400px;
  width: 50%;
`
const Tags = styled.div`
  width: 50%;
`
