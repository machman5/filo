import React from 'react'
import debounce from 'lodash/debounce'
import {
  Segment,
  Divider,
  Message,
  Icon,
  Input,
  Accordion
} from 'semantic-ui-react'
import Header from '../components/Header'
import axios from 'axios'

export default class Setup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      proxyUrl: props.proxyUrl,
      isLoading: false,
      isValid: true
    }
  }

  proxyUrlOnChange = (_, { value }) => {
    this.setState({ proxyUrl: value })
    this.validateUrl()
  }

  validateUrl = debounce(() => {
    if (!isValidURL(this.state.proxyUrl)) {
      this.setState({ isValid: false })
    } else {
      this.setState({ isLoading: true })
      axios
        .get(this.state.proxyUrl)
        .then(res => {
          if (res.status !== 200 || res.data !== 'Filo.')
            throw new Error()

          this.setState({ isLoading: false, isValid: true })
          const localState = { ...this.props, proxyUrl: this.state.proxyUrl }
          chrome.storage.local.set(localState)
        })
        .catch(() => this.setState({ isLoading: false, isValid: false }))
    }
  }, 600)

  inputIcon() {
    if (!this.state.isValid) return 'warning circle'
    if (
      !this.state.isLoading &&
      this.state.isValid &&
      this.state.proxyUrl.length > 0
    ) {
      return 'check'
    }
  }

  render() {
    return (
      <Segment className="wrapper">
        <Header />
        <Segment basic attached>
          <Message icon warning>
            <Icon name="power cord" />
            <Message.Content>
              <Message.Header>
                Welcome to Filo!
              </Message.Header>
              <p>
                You've installed the extension, however, you'll need to run the server-side extension to work.
              </p>
              <p>
                To do that, we provide the following for you to get your up and running within minutes.
              </p>
            </Message.Content>
          </Message>

          <h3>Data Compression Service</h3>
          {this.state.proxyUrl.length > 0 &&
            !this.state.isLoading &&
            !this.state.isValid && (
              <Message
                error
                header="Invalid Address"
                content="Given URL does not run Filo. Try again or reconfigure your server."
              />
            )}
          <Input
            fluid
            type="url"
            label="URL"
            loading={this.state.isLoading}
            icon={this.inputIcon()}
            value={this.state.proxyUrl}
            onChange={this.proxyUrlOnChange}
          />

          {this.state.proxyUrl === '' && (
            <div style={{ paddingTop: '1em' }}>
              <p>
                To start using Filo, you'll need to setup the Filo compressor.
              </p>
              <p>
                Check out the installation guide bellow.<br /> Once you have
                your data compression service running &mdash; put its URL into
                the field above.
              </p>
            </div>
          )}

          <h3>Installation Guide</h3>
          <Accordion fluid styled>
            <Accordion.Title>
              <Icon name="dropdown" /> Heroku
            </Accordion.Title>
            <Accordion.Content>
              <p>
                Heroku is a cloud-based app hosting provider.<br />
                They offer a free plan which has limited resources and needs to
                sleep 8 hours per day.
              </p>
              <p>
                Click the button bellow to deploy your personal instance to Heroku.
              </p>
              <a
                href="https://heroku.com/deploy?template=https://github.com/sr229/filo"
                rel="nofollow"
                target="_blank"
              >
                <img
                  src="https://camo.githubusercontent.com/83b0e95b38892b49184e07ad572c94c8038323fb/68747470733a2f2f7777772e6865726f6b7563646e2e636f6d2f6465706c6f792f627574746f6e2e737667"
                  alt="Deploy"
                  data-canonical-src="https://www.herokucdn.com/deploy/button.svg"
                />
              </a>
            </Accordion.Content>

            <Accordion.Title>
              <Icon name="dropdown" /> Self-hosted
            </Accordion.Title>
            <Accordion.Content>
              <p>
                Filo compressor is a Node.js app which you can run on
                any server that supports Node.js. Check out{' '}
                <a href="https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04">
                  this guide
                </a>{' '}
                on how to setup Node.js on Ubuntu.
              </p>
              <p>
                DigitalOcean also provides an{' '}
                <a href="https://www.digitalocean.com/products/one-click-apps/node-js/">
                  easy way
                </a>{' '}
                to setup a server ready to host Node.js apps.
              </p>
            </Accordion.Content>
          </Accordion>
        </Segment>
      </Segment>
    )
  }
}

function isValidURL(str) {
  var a = document.createElement('a')
  a.href = str
  return a.host && a.host != window.location.host
}
