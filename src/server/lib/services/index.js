
import sgMail from '@sendgrid/mail';

export default function initServices(config) {

  const { SENDGRID_API_KEY } = config;
  sgMail.setApiKey(SENDGRID_API_KEY);

}

