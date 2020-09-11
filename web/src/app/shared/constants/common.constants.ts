export class CONSTANTS {
  static NO_CONTENT_INFO = 'No content';

  // no image
  static NO_IMAGE_URL = './assets/images/userpic/noimage_croped.png';
  static NO_IMAGE_TITLE = 'noimage';

  // regex
  static PHONE_REGEX: RegExp = /^[0-9]+$/;
  static LOGIN_REGEX: RegExp = /^[a-zA-Z0-9]+$/;
  static WWW_REGEX: RegExp = /^(http:\/\/www.|https:\/\/www.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  static ONLY_TEXT_REGEX: RegExp = /^[a-zA-Zа-яА-ЯіІїЇàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
}
