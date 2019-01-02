
export const signinValidateEmail = {

  run(args, model, catcher) {

    const {
      email,
    } = args;

    return model.getEntityByUniqueKey(email)
    .then(async userObject => {

      if (!userObject) return Promise.resolve({ error: 'EMAIL_IS_NOT_REGISTERED' });

      const isAlreadyRegistered = userObject.attrs.find(item => {
        return item.key === 'isRegistered' && item.value === true;
      });

      if (!isAlreadyRegistered) return Promise.resolve({ error: 'EMAIL_IS_NOT_REGISTERED' });

      const _id = userObject._id;

      return Promise.resolve({
        _id,
        name: await model.getKeyCurrentValue(_id, 'name'),
      });

    })
    .then(res => {
      return {
        data: { user_id: res._id, name: res.name },
        error: res.error || null,
      };
    })
    .catch(catcher);

  }

};
