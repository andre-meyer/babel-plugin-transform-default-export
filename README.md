
# babel-plugin-transform-default-import

This plugin transforms nested subpackage import into member-style imports that are not nested. Here's an example:

```
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import Something from '@material-ui/core/ADifferentName';
```

into

```
import { Box } from '@material-ui/core';
import { Modal } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { ADifferentName as Something } from '@material-ui/core';
```

### Why?

I developed this project to use `@material-ui/core` as an external dependency in a project that used AMD, because without this plugin, it would create many dependencies that would require `@material-ui/core/Box`, `@material-ui/core/Modal`, etc.
There were webpack configurations that make this possible, but not for AMD libraries.

### Notes

Too lazy to put this on npm. Good luck.