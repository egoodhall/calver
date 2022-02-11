# CalVer [![build-test](https://github.com/emm035/calver/actions/workflows/test.yml/badge.svg)](https://github.com/emm035/calver/actions/workflows/test.yml)

Generate a calendar version and (optionally) generate a tag for it.

### Inputs

- `token` - the github token associated with the build
- `create_tag` - whether a new tag should be created, based off the new version and tag prefix
- `tag_prefix` - a prefix for the tag. For a prefix of `my_feature/v` a version of `22.1.3`, the generated tag would be `my_feature/v`. The prefix is also used when fetching any existing tags.
- `release_months` - months that should trigger a new minor release, separated by newlines or commas. Months are parsed using moment.js, so `July`, `Jul`, will trigger a new minor version during July. 

### Outputs

- `old_tag` - the tag, prefixed with `tag_prefix` that has the highest version found in the repo. If no matching tag was found, `old_tag` will be an empty string.
- `old_version` - the last version, parsed from `old_tag`. If no matching tag was found, `old_version` will be an empty string.
- `new_tag` - the new tag, created by combining `tag_prefix` and `new_version`.
- `new_version` - the new version, based on the date and/or `old_version`.
