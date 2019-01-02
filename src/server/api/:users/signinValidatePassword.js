
export const signinValidatePassword = {

  run(args, model, catcher) {

    const {
      email,
      password,
    } = args;

    return model.getEntityByUniqueKey(email)
    .then(async userObject => {

      const _id = userObject._id;

      const isPasswordOK = await model.compareWithCurrentValue({
        _id,
        key: 'password',
        value: password,
        encrypted: true,
      });

      if (!isPasswordOK) return Promise.resolve({ error: 'PASSWORD_IS_NOT_CORRECT' });

      return Promise.resolve({ data: { isPasswordOK, user_id: _id }});

    })
    .catch(catcher);

  }

};
