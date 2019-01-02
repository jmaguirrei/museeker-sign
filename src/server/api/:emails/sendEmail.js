
import sgMail from '@sendgrid/mail';
import { templates } from './templates';

export const sendEmail = {

  run(args, model, catcher) {

    const {
      template,
      email,
      language = 'en',
      plainText = '',
      data,
    } = args;

    const emailBody = {
      to: email,
      from: templates[template].sender,
      // subject: data.subject,
      text: plainText,
      templateId: templates[template].id,
      dynamic_template_data: {
        spanish: language === 'es',
        ...data,
      },
    };

    let emailId = null;

    return model.createEntity({ domain: ':emails', attrs: { status: 0, emailBody }})
    .then(res => {
      emailId = res._id;
      return sgMail.send(emailBody);
    })
    .then(res => {
      if (!res) return Promise.reject({ error: 'Error sending email' });

      return model.addAttrsToEntity({
        _id: emailId,
        attrs: [
          { key: 'status', value: 1 },
        ],
      });

    })
    .catch(catcher);

  }

};
