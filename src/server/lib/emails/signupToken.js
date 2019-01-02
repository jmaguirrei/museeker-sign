
import _ from '@jmaguirrei/belt';

export const signupToken = args => {

  const {
    token,
    email,
    language,
    name,
  } = args;

  return {

    template: 'token',
    email,
    language,
    plainText: _.get({
      en: `Your token is ${token}`,
      es: `Tu token es ${token}`,
    }, language),
    data: {
      subject: _.get({
        en: 'Account registration token',
        es: 'Código para el registro de tu cuenta',
      }, language),
      name,
      action: _.get({
        en: 'finish your account registration',
        es: 'finalizar el registro de tu cuenta',
      }, language),
      token,
    },
  };

};
