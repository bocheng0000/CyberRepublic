import BaseService from '../model/BaseService'
import { api_request } from '@/util'

export default class extends BaseService {
  constructor() {
    super()
    this.prefixPath = '/api/elip'
  }

  async create(param) {
    const path = `${this.prefixPath}/create`
    const rs = await api_request({
      path,
      method: 'post',
      data: param
    })
    return rs
  }

  async update(param) {
    const path = `${this.prefixPath}/update`
    const rs = await api_request({
      path,
      method: 'post',
      data: param
    })
    return rs
  }

  async getData(param) {
    const path = `${this.prefixPath}/detail/${param.id}`
    const rs = await api_request({
      path,
      method: 'get'
    })
    return rs
  }

  async listData(param) {
    let rs
    const path = `${this.prefixPath}/list`
    rs = await api_request({
      path,
      method: 'get',
      data: param
    })
    return rs
  }
}
