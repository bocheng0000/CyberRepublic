import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Col, Row } from 'antd'
import I18N from '@/I18N'
import { ELASTOS_LINKS } from '@/constant'
import Mail from '@/assets/svg/mail'
import Twitter from '@/assets/svg/twitter'
import Discord from '../../../assets/svg/discord'
import './style.scss'

export default class extends BaseComponent {
  ord_render() {
    return (
      <div className="c_Footer">
        <div className="horizGap" />
        <div className="footer-box">
          <Row className="d_rowFooter d_footerSection">
            <Col className="resources" xs={24} sm={12} md={5}>
              <div className="links footer-vertical-section">
                <div className="title brand-color">
                  {I18N.get('landing.footer.resources')}
                </div>
                <div className="footer-color-dark">
                  <a href="/vision">{I18N.get('vision.00')}</a>
                </div>
                <div className="footer-color-dark">
                  <a href={ELASTOS_LINKS.GITHUB} target="_blank">
                    {I18N.get('landing.footer.github')}
                  </a>
                </div>
                <div className="footer-color-dark">
                  <a href="/privacy">
                    {I18N.get('landing.footer.privacyPolicy')}
                  </a>
                </div>
                <div className="footer-color-dark">
                  <a href="/terms">
                    {I18N.get('landing.footer.termsAndConditions')}
                  </a>
                </div>
              </div>
            </Col>
            <Col className="vdiv" />
            <Col className="contact-container" xs={24} sm={24} md={7}>
              <div className="contact footer-vertical-section">
                <div className="title brand-color">
                  {I18N.get('landing.footer.contact')}
                </div>
                <div className="footer-color-dark">
                  <a href="mailto:cyberrepublic@elastos.org">
                    <Mail fill="#5E6C86" />
                  </a>
                  <a href="https://twitter.com/cyber__republic">
                    <Twitter fill="#5E6C86" />
                  </a>
                  <a href="https://discord.gg/elastos">
                    <Discord fill="#5E6C86" />
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
