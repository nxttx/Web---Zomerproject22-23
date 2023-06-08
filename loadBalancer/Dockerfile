FROM nginx:1.25.0

# Copy nginx configuration file
COPY ./loadBalancer/nginx.conf /etc/nginx/nginx.conf

# Copy html files from '../front-end' to '/usr/share/nginx/html'
COPY ./front-end /usr/share/nginx/html



#mkdir /etc/nginx/certs
RUN mkdir /etc/nginx/certs

#generate self-signed certificate

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/certs/server.key -out /etc/nginx/certs/server.crt -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=localhost"