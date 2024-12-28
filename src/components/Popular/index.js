import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {FaGreaterThan, FaLessThan} from 'react-icons/fa'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Popular extends Component {
  state = {
    popularMovies: [],
    apiStatus: apiStatusConstants.initial,
    currentPage: 1, // State for current page
    itemsPerPage: 8, // Number of items per page
  }

  componentDidMount() {
    this.getPopularMovies()
  }

  getPopularMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(
      'https://apis.ccbp.in/movies-app/popular-movies',
      options,
    )
    const data = await response.json()
    if (response.ok === true) {
      const updateData = data.results.map(each => ({
        id: each.id,
        title: each.title,
        overview: each.overview,
        backdropPath: each.backdrop_path,
        posterPath: each.poster_path,
      }))
      this.setState({
        popularMovies: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getPopularMovies()
  }

  handlePageChange = page => {
    this.setState({currentPage: page})
  }

  renderFailureView = () => (
    <div className="failure-cont">
      <img
        src="https://res.cloudinary.com/dgwvwp4qo/image/upload/v1733027624/Background-Completepopular-failure_b3ltm7.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.onRetry}>
        Try Again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {popularMovies, currentPage, itemsPerPage} = this.state
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentMovies = popularMovies.slice(startIndex, endIndex)

    return (
      <>
        <ul className="popular-ul-list">
          {currentMovies.map(each => (
            <Link to={`/movies/${each.id}`}>
              <li key={each.id}>
                <img
                  className="popular-img"
                  src={each.posterPath}
                  alt={each.title}
                />
              </li>
            </Link>
          ))}
        </ul>
        {this.renderPagination()}
      </>
    )
  }

  renderPagination = () => {
    const {popularMovies, currentPage, itemsPerPage} = this.state
    const totalPages = Math.ceil(popularMovies.length / itemsPerPage)

    return (
      <div className="pagination-container">
        <button
          type="button"
          onClick={() => this.handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaLessThan />
        </button>
        {Array.from({length: totalPages}, (_, index) => (
          <button
            type="button"
            key={index + 1}
            onClick={() => this.handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() => this.handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaGreaterThan />
        </button>
      </div>
    )
  }

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderApiStatus()}
        <Footer />
      </div>
    )
  }
}

export default Popular
