
import _ from '@jmaguirrei/belt';

export const forgotToken = args => {

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
        en: 'Password change token',
        es: 'Código para el cambio de contraseña',
      }, language),
      name,
      action: _.get({
        en: 'change your password',
        es: 'cambiar tu contraseña',
      }, language),
      token,
    },
  };

};
