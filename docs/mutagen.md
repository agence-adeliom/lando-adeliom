# Mutagen

Automatically start and stop mutagen syncs when starting and stopping a Lando project.

One of the main issues in having your development environment fully Dockerized on Windows and Mac is performance. Jumping the filesystem boundary (e.g. Mac FS -> Linux container FS or vice versa) causes performance to tank dramatically.

Luckily, Lando provides us with a nice performance feature where directories defined in `excludes` get one-way synced from the host to Docker named volumes. These Docker named volumes are then mounted at the appropriate locations in the containers. This solves the 'jumping-filesystem-boundary' performance issue. 

A drawback of this is once files are in the named volumes, any changes to them do not get synced back to the host. This is problematic when developing, where your IDE needs the package folders (e.g. `vendor` or `node_modules`) for proper intellisense.

This is where this plugin comes in. Add a base [Mutagen](https://mutagen.io) configuration file to your project, add some `excludes` in your Lando file and the plugin will do the following:

1. On `lando start`, create an amended mutagen configuration file with the appropriate directory syncs
2. After `lando start`, start up the mutagen syncs, such that modified files in the `excludes` directories will be synced back to the host
3. On `lando stop`, stop the mutagen syncs
4. After `lando stop`, remove the temporary amended mutagen configuration file

## Usage
1. Have an existing Lando project containing a `.lando.yml` file
2. Add an [excludes configuration section](https://docs.lando.dev/config/performance.html) to it. E.g.
    ```
    excludes:
      - var
      - vendor
    ```
3. Add a `.lando.mutagen.yml` file, which contains your base [mutagen configuration](https://mutagen.io/documentation/orchestration/projects). Example contents (enough to get started):
    ```
    sync:
        defaults:
            flushOnCreate: true
            ignore:
                vcs: false
            permissions:
                defaultFileMode: 644
                defaultDirectoryMode: 755
    ```
4. Add `*.mutagen.yml.*` to your gitingore.
5. Run `lando rebuild -y`. This might take some time due to the file syncs.
6. Profit! File changes in the `excludes` directories will now be synced back to the host and you can enjoy close-to linux-native Docker filesystem performance.