import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  pending: 'PENDING',
}
// Write your code here
class GithubPopularRepos extends Component {
  state = {
    activeFilterId: languageFiltersData[0].id,
    apiStatus: apiStatusConstants.initial,
    reposLis: [],
  }

  componentDidMount() {
    this.getReposList()
  }

  changeFilterLanguage = id => {
    this.setState({activeFilterId: id}, this.getReposList)
  }

  getReposList = async () => {
    this.setState({apiStatus: apiStatusConstants.pending})
    const {activeFilterId} = this.state

    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeFilterId}`

    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)

    if (response.ok === true) {
      const updatedData = data.popular_repos.map(eachRepo => ({
        id: eachRepo.id,
        title: eachRepo.title,
        starsCount: eachRepo.stars_count,
        forksCount: eachRepo.forks_count,
        issuesCount: eachRepo.issues_count,
        avatarUrl: eachRepo.avatar_url,
      }))
      this.setState({
        reposLis: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {reposLis} = this.state

    return (
      <ul className="repositories-list">
        {reposLis.map(eachRep => (
          <RepositoryItem key={eachRep.id} repDetails={eachRep} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure-view"
        className="failure-view-img"
      />
      <h1 className="error-msg">Something Went Wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderFilterItems = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.pending:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderLanguageFiltersList = () => {
    const {activeFilterId} = this.state
    return (
      <ul className="filters-list">
        {languageFiltersData.map(eachLanguage => (
          <LanguageFilterItem
            key={eachLanguage.id}
            languageDetails={eachLanguage}
            onChangeFilter={this.changeFilterLanguage}
            isActive={activeFilterId === eachLanguage.id}
          />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div className="app-container">
        <div className="responsive-container">
          <h1>Popular</h1>
          {this.renderLanguageFiltersList()}

          {this.renderFilterItems()}
        </div>
      </div>
    )
  }
}

export default GithubPopularRepos
