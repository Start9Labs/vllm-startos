ARG IMAGE
FROM ${IMAGE}
# The base image's CA store, and every certifi copy in it, is only as current as its last release.
RUN apt-get update \
 && apt-get install -y --no-install-recommends --only-upgrade ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && ! grep -q MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr /etc/ssl/certs/ca-certificates.crt \
 && find / -xdev -path '*/certifi/cacert.pem' -exec cp /etc/ssl/certs/ca-certificates.crt {} \; \
 && ! find / -xdev -path '*/certifi/cacert.pem' -exec grep -l MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr {} + | grep -q .
