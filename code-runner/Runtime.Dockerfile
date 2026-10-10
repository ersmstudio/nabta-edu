FROM mcr.microsoft.com/dotnet/sdk:8.0
RUN useradd --create-home --uid 10001 student
COPY run.sh /usr/local/bin/nabta-run
RUN chmod 0555 /usr/local/bin/nabta-run
USER 10001:10001
ENV HOME=/tmp DOTNET_CLI_HOME=/tmp/dotnet DOTNET_NOLOGO=1 DOTNET_CLI_TELEMETRY_OPTOUT=1
ENTRYPOINT ["/usr/local/bin/nabta-run"]
