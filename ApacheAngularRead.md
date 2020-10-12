# Apache2 Angular configuration

**Requirements:**

- Ubuntu/ Debian OS
- Apache2 [Setup][Apache2-Setup]
- NodeJs + Angular [Setup][Angular-Setup] 

[Angular-Setup]: https://www.howtoforge.com/how-to-install-angular-on-ubuntu-2004/

[Apache2-Setup]: https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-18-04

### Steps to follow:

- Write Apache Configuration file
- Enable your website
- Enable rewrite module
- Start / Restart Apache service


cat /etc/apache2/sites-available/yoursite.conf

```
<VirtualHost *:80>
	ServerName xyz.example.com
	DocumentRoot /var/www/html/dist
	DirectoryIndex index.html
	...
</VirtualHost>
<Directory "/var/www/html/dist">
        Options FollowSymLinks
        Allow from all
        AllowOverride All
        <IfModule mod_rewrite.c>
        RewriteEngine on
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^(.*)$ index.html
        </IfModule>
</Directory>
```

```
a2ensite yoursite.conf
a2enconf rewrite
```

```
systemctl restart apache2
```

Use link for [Reference][identifier]
[identifier]: https://www.thetopsites.net/article/52125615.shtml