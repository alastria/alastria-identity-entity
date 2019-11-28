FROM nginx:1.9.15

### File Author / Maintainer
MAINTAINER "El que lo lea"

#nginx configuration disable defaults
RUN mv /etc/nginx/conf.d/default.conf default.conf.disabled

#Copy the custom configuration
COPY docker_conf/nginx.conf /etc/nginx/nginx.conf

#Copy the application distribution
COPY dist /usr/share/nginx/html
