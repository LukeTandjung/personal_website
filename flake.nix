{
  description = "Sup Nix Flake";

  inputs = {
    # This exact nixpkgs revision packages Typst 0.15.1.
    nixpkgs.url = "github:NixOS/nixpkgs/d2f67949798825fe853f7c5d0492b8bf016d3f88";

    # Treat Calepin as pinned source instead of importing its flake inputs.
    calepin-src = {
      url = "github:vincentarelbundock/calepin/v0.0.57";
      flake = false;
    };
  };

  outputs =
    {
      nixpkgs,
      calepin-src,
      ...
    }:
    let
      systems = [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-darwin"
        "x86_64-linux"
      ];
    in
    {
      devShells = nixpkgs.lib.genAttrs systems (
        system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };
          typst =
            assert pkgs.lib.assertMsg (pkgs.typst.version == "0.15.1")
              "personal_website requires Typst 0.15.1";
            pkgs.typst;
          calepin = pkgs.rustPlatform.buildRustPackage {
            pname = "calepin";
            version = "0.0.57";
            src = calepin-src;

            cargoLock.lockFile = calepin-src + "/Cargo.lock";
            buildAndTestSubdir = "calepin";

            nativeBuildInputs = [
              pkgs.makeWrapper
              typst
            ];

            # Two upstream tests download Typst Universe packages, which Nix's
            # sandbox intentionally cannot access.
            doCheck = false;

            postFixup = ''
              wrapProgram $out/bin/calepin \
                --prefix PATH : ${pkgs.lib.makeBinPath [ typst ]}
            '';
          };
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.bun
              pkgs.ngrok
              typst
              calepin
            ];
          };
        }
      );
    };
}
