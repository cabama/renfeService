FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/renfe_service
RUN mkdir -p /usr/src/renfe_service/src
WORKDIR /usr/src/renfe_service

# INSTALL CHROME DEV
RUN  apt-get update \
  # See https://crbug.com/795759
  && apt-get install -yq libgconf-2-4 \
  # Install latest chrome dev package, which installs the necessary libs to
  # make the bundled version of Chromium that Puppeteer installs work.
  && apt-get install -y wget --no-install-recommends \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
  && chmod +x /usr/sbin/wait-for-it.sh

# Install Nodemon
RUN npm install nodemon mocha supervisor -g

# COPY PROJECT SETTINGS
ADD src /usr/src/renfe_service/src

# FINALLY INSTALL PROYECT DEPS
WORKDIR /usr/src/renfe_service/src
RUN npm install