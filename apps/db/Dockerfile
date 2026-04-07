FROM ghcr.io/amacneil/dbmate

COPY migrations ./migrations
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["up"]
