
// import _ from '@jmaguirrei/belt';

export const forgotSetNewPassword = {

  run(args, model, catcher) {

    const {
      email,
      password,
      token,
    } = args;

    return model.compareWithCurrentValue({ uniqueKey: email, key: 'forgotToken', value: token })
    .then(async res => {
      const userObject = await model.getEntityByUniqueKey(email);
      return Promise.resolve({
        data: res ? { user_id: userObject._id } : null,
        error: !res ? 'INVALID_FORGOT_TOKEN' : null,
      });
    })
    .then(res => {
      if (res.data) {
        return model.addAttrsToEntity({
          uniqueKey: email,
          attrs: [
            { key: 'password', value: password, encrypt: true },
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
