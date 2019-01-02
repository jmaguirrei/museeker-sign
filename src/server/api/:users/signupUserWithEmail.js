
export const signupUserWithEmail = {

  run(args, model, catcher) {

    const {
      _id: givenId,
      name,
      email,
    } = args;

    return model.getEntityByUniqueKey(email)
    .then(userObject => {

      if (!userObject) {
        return model.createEntity({
          _id: givenId,
          uniqueKey: email,
          domain: ':users',
          user_id: givenId,
          attrs: {
            name,
            email,
          },
        });
      }

      const isAlreadyRegistered = userObject.attrs.find(item => {
        return item.key === 'isRegistered' && item.value === true;
      });

      if (isAlreadyRegistered) return Promise.resolve({ error: 'EMAIL_ALREADY_REGISTERED' });

      // If exists but not registered, just skip this step and continue...
      return Promise.resolve({ _id: userObject._id });

    })
    .then(res => {
      // console.log("res signupUserWithEmail -------------------------->", res);
      return {
        data: { _id: res._id || givenId },
        error: res.error || null,
      };
    })
    .catch(catcher);

  }

};
