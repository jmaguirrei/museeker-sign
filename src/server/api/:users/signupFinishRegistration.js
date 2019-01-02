
// import _ from '@jmaguirrei/belt';

export const signupFinishRegistration = {

  run(args, model, catcher) {

    const {
      _id,
      password,
      token,
    } = args;

    return model.compareWithCurrentValue({ _id, key: 'signupToken', value: token })
    .then(res => {
      return Promise.resolve({
        data: res,
        error: !res ? 'INVALID_SIGNUP_TOKEN' : null,
      });
    })
    .then(res => {
      if (res.data) {
        return model.addAttrsToEntity({
          _id,
          attrs: [
            { key: 'password', value: password, encrypt: true },
            { key: 'isRegistered', value: true },
          ],
        })
        .then(() => {
          return Promise.resolve(res);
        });
      }
      return Promise.resolve(res);
    })
    .catch(catcher);

  }

};
