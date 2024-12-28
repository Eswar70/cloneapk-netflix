import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {format} from 'date-fns'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MovieDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    movieDetails: {},
    currentPage: 1,
    itemsPerPage: 6,
  }

  componentDidMount() {
    this.getMovieDetails()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    const {params} = match
    const {id} = params

    if (prevProps.match.params.id !== id) {
      this.getMovieDetails()
    }
  }

  getMovieDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(
      `https://apis.ccbp.in/movies-app/movies/${id}`,
      options,
    )
    const data = await response.json()
    if (response.ok === true) {
      const updateMovie = {
        id: data.movie_details.id,
        overview: data.movie_details.overview,
        title: data.movie_details.title,
        backdropPath: data.movie_details.backdrop_path,
        adult: data.movie_details.adult,
        runtime: data.movie_details.runtime,
        releaseDate: data.movie_details.release_date,
        voteAverage: data.movie_details.vote_average,
        voteCount: data.movie_details.vote_count,
        budget: data.movie_details.budget,
        genres: data.movie_details.genres.map(each => ({
          id: each.id,
          name: each.name,
        })),
        spokenLanguages: data.movie_details.spoken_languages.map(each => ({
          id: each.id,
          englishName: each.english_name,
        })),
        similarMovies: data.movie_details.similar_movies.map(each => ({
          id: each.id,
          title: each.title,
          posterPath: each.poster_path,
        })),
      }
      this.setState({
        movieDetails: updateMovie,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  handlePageChange = direction => {
    this.setState(prevState => ({
      currentPage:
        direction === 'next'
          ? prevState.currentPage + 1
          : prevState.currentPage - 1,
    }))
  }

  renderPaginationControls = () => {
    const {currentPage, itemsPerPage, movieDetails} = this.state
    const {similarMovies} = movieDetails
    const totalPages = Math.ceil(similarMovies.length / itemsPerPage)

    return (
      <div className="pagination-controls">
        <button
          type="button"
          onClick={() => this.handlePageChange('prev')}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => this.handlePageChange('next')}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    )
  }

  renderSimilarMovies = () => {
    const {currentPage, itemsPerPage, movieDetails} = this.state
    const {similarMovies} = movieDetails

    const startIndex = (currentPage - 1) * itemsPerPage
    const currentMovies = similarMovies.slice(
      startIndex,
      startIndex + itemsPerPage,
    )

    return (
      <>
        <ul className="moreMovies">
          {currentMovies.map(each => (
            <li key={each.id}>
              <Link to={`/movies/${each.id}`} key={each.id}>
                <img src={each.posterPath} alt={each.title} />
              </Link>
            </li>
          ))}
        </ul>
        {this.renderPaginationControls()}
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-cont">
      <img
        src="https://res.cloudinary.com/dgwvwp4qo/image/upload/v1733027624/Background-Completepopular-failure_b3ltm7.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={this.getMovieDetails}>
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
    const {movieDetails} = this.state
    const {
      backdropPath,
      title,
      overview,
      runtime,
      adult,
      releaseDate,
      voteCount,
      voteAverage,
      budget,
    } = movieDetails
    const hours = Math.floor(runtime / 60)
    const minutes = Math.floor(runtime % 60)
    const year = format(new Date(releaseDate), 'yyyy')
    const movieRelease = format(new Date(releaseDate), 'do MMMM yyyy')
    return (
      <div>
        <div
          className="background-cont"
          style={{backgroundImage: `url(${backdropPath})`}}
          alt={title}
        >
          <div className="background">
            <h1>{title}</h1>
            <div className="para-cont">
              <p>
                {hours}h {minutes}m
              </p>
              {adult === true ? (
                <p className="adult">A</p>
              ) : (
                <p className="adult">U/A</p>
              )}
              <p>{year}</p>
            </div>
            <p>{overview}</p>
            <button type="button">Play</button>
          </div>
        </div>
        <div className="details-cont">
          <div>
            <h1>Genres</h1>
            {movieDetails.genres.map(each => (
              <p key={each.id}>{each.name}</p>
            ))}
          </div>
          <div>
            <h1>Audio Available</h1>
            {movieDetails.spokenLanguages.map(each => (
              <p key={each.id}>{each.englishName}</p>
            ))}
          </div>
          <div>
            <h1>Rating Count</h1>
            <p>{voteCount}</p>
            <h1>Rating Average</h1>
            <p>{voteAverage}</p>
          </div>
          <div>
            <h1>Budget</h1>
            <p>{budget}</p>
            <h1>Release Date</h1>
            <p>{movieRelease}</p>
          </div>
        </div>
        <h1 className="moreLike">More like this</h1>
        {this.renderSimilarMovies()}
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

export default MovieDetails
