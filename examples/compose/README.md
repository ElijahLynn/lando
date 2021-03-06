Compose Example
===============

This example is for a "catch all" service that allows power users to specify custom services that are not currently one of Lando's "supported" services. Technically speaking, this service is just a way for a user to define a service directly using the [Docker Compose V3](https://docs.docker.com/compose/compose-file/) file format. **THIS MEANS THAT IT IS UP TO THE USER TO DEFINE A SERVICE CORRECTLY**.

This service is useful if you are:

1. Thinking about contributing your own custom Lando service and just want to prototype something
2. Using Docker Compose config from other projects
3. Need a service not currently provided by Lando itself

See the `.lando.yml` in this directory for configuration options.

This is the dawning of the age of custom docker images
------------------------------------------------------

You should be able to run the following steps to get up and running with this example.

```bash
# Start up the example
lando start
```

Validate
--------

```bash
# Verify we used the custom image
docker inspect compose_appserver_1 | grep Image | grep drupal:8

# Verify the lando entrypoint
docker inspect compose_appserver_1 | grep Path | grep lando-entrypoint.sh

# Verify the custom compose command
docker inspect compose_appserver_1 | grep docker-php-entrypoint
docker inspect compose_appserver_1 | grep apache2-foreground

# Verify the default mysql creds
sleep 5
lando ssh database -c "mysql -u mysql -ppassword database -e\"quit\""
```

Nuke it all
-----------

```bash
# Destroy this example
lando destroy -y
```
