import { PushNotification } from '../../utils/notification.js';

export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewReport({description, photo, lat, lon }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.storeNewReport({
        description,
        photo,
        lat,
        lon
      });
  
      if (!response.ok) {
        console.error('postNewReport: response:', response);
        PushNotification.show('error', error.message || 'Gagal mengupload cerita');
        this.#view.storeFailed(response.message);
        return;
      }

      PushNotification.show('success', 'Cerita berhasil diupload!');
  
      this.#view.storeSuccessfully(response.message);
      
    } catch (error) {
      console.error('postNewReport: error:', error);
      PushNotification.show('error', error.message || 'Gagal mengupload cerita');
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
