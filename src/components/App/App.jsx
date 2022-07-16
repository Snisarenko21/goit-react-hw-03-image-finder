import { Component } from 'react';
import Modal from 'components/Modal/Modal';
import ImageGallery from 'components/ImageGallery';
import ImageGalleryItem from 'components/ImageGalleryItem';
import LoaderSpiner from 'components/Loader/Loader';
import api from 'services/api';
import Searchbar from '../Searchbar';
import css from './App.module.css';
import LoadMore from 'components/Button/Button';

const Status = {
  LOADING: 'loading',
  LOADED: 'loaded',
};

export class App extends Component {
  state = {
    pictureName: '',
    pictureData: '',
    pictureModal: '',
    status: null,
    page: 1,
  };

  componentDidUpdate(prevState, prevProps) {
    const prevSearch = prevProps.pictureName;
    const nextSearch = this.state.pictureName;
    const nextPage = this.state.page;
    const prevPage = prevProps.page;

    if (prevSearch !== nextSearch) {
      this.loadPicture();
      this.resetData();
    }
    if (nextPage > prevPage) {
      this.loadPicture();
    }
    this.scrollToBottom();
  }

  loadPicture = () => {
    const { pictureName, page } = this.state;
    this.setState({ status: Status.LOADING });
    api
      .fetchPicture(pictureName, page)
      .then(res => {
        this.setState(prevState => ({
          pictureData: [...prevState.pictureData, ...res.data.hits],
          status: Status.LOADED,
        }));
      })

      .catch(error => console.log(error));
  };

  handleFormSubmit = pictureName => {
    this.resetPage();

    this.setState({ pictureName });
  };

  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  pictureModalClick = picture => {
    this.setState({
      pictureModal: picture,
    });
  };

  resetPage() {
    this.setState({
      page: 1,
    });
  }

  resetData() {
    this.setState({
      pictureData: '',
    });
  }

  closeModal = () => {
    this.setState({
      pictureModal: '',
    });
  };

  scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }

  render() {
    const { status, pictureData, pictureModal } = this.state;
    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.handleFormSubmit} />
        {status === 'loading' && <LoaderSpiner />}
        {pictureData.length > 0 && (
          <ImageGallery>
            <ImageGalleryItem
              pictureData={pictureData}
              onClick={this.pictureModalClick}
            />
          </ImageGallery>
        )}
        {status === 'loaded' && <LoadMore onClick={this.loadMore} />}
        {/* {images.length !== 0 && <PixabayImageGallery images={images} />} */}
        {pictureModal.length > 0 && (
          <Modal onClose={this.closeModal}>
            <img src={pictureModal} alt="" />
          </Modal>
        )}
      </div>
    );
  }
}
