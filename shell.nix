{ pkgs ? import <nixpkgs> {}}:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_22
    prisma-engines
    cypress
  ];

  shellHook = ''
    export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
    export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
    export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
    export PRISMA_FMT_BINARY="${pkgs.prisma-engines}/bin/prisma-fmt"
    export PATH="$PWD/node_modules/.bin/:$PATH"
    export CYPRESS_INSTALL_BINARY="0"
    export CYPRESS_RUN_BINARY="${pkgs.cypress}/bin/Cypress"
  '';
}

