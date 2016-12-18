import path from 'path';
import config from 'config';
import { upload } from 'hotvenue-utils/utils/cloud';

export function urlRelativeFactory(what, nameAdd) {
  return function urlRelative() {
    const file = `${config.get(`aws.s3.folder.${what}`)}/${this.id}${nameAdd || ''}`;
    const files = {
      original: `${file}${config.get(`app.extension.${what}`)}`,
    };

    if (!config.has(`app.${what}.sizes`)) {
      return files.original;
    }

    Object.keys(config.get(`app.${what}.sizes`)).forEach((key) => {
      files[key] = `${file}@${key}${config.get(`app.extension.${what}`)}`;
    });

    return files;
  };
}

export function urlAbsoluteFactory(what) {
  return function urlAbsolute() {
    const urls = {};
    const baseurl = `https://s3-${config.get('aws.region')}.amazonaws.com/${config.get('aws.s3.bucket')}`;

    if (typeof this[what] === 'string') {
      return `${baseurl}/${this[what]}`;
    }

    Object.keys(this[what]).forEach((size) => {
      urls[size] = `${baseurl}/${this[what][size]}`;
    });

    return urls;
  };
}

export function fileHookFactory(what, fields, nameAdds = {}) {
  return function fileHook(instance) {
    return Promise.all(fields.map((field) => {
      if (instance.changed(field)) {
        const filepath = instance[field];
        const ext = path.extname(filepath);

        return upload(filepath, `${config.get(`aws.s3.folder.${what}.tmp-${field}`)}/${instance.id}${nameAdds[field] || ''}${ext}`);
      }

      return true;
    }));
  };
}
