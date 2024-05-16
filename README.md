
<!-- PUT PROJECT'S LOGO ONCE DEV IS MERGED TO MAIN! -->

<br />
<p align="center">
  <a href="https://github.com/oslabs-beta/sapling">
    <img src="PATH TO LOGO" alt="Logo" height="120">
  </a>

  <h3 align="center">Dockular</h3>

  <p align="center">
    A convenient way to traverse your React application.
    <br />
    <a href="https://github.com/oslabs-beta/sapling"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/oslabs-beta/sapling/issues">Report Bug</a>
    ·
    <a href="https://github.com/oslabs-beta/sapling/issues">Request Feature</a>
  </p>
</p>

<hr>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#installation">Installation</a></li>
    <li>
      <a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#local-development">Local development</a>
      <ul>
        <li><a href="#frontend-development">Frontend development</a></li>
      </ul>
      <ul>
        <li><a href="#backend-development">Backend development</a></li>
      </ul>
      <ul>
        <li><a href="#clean-up">Clean up</a></li>
      </ul>
    </li>
    <li><a href="#open-source-information">Open Source Information</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#creators">Creators</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>
<hr>


## About The Project
Description of Dockular goes here

### Built With
* [Docker](https://www.docker.com/)
* [React](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Go](https://go.dev/)
* [Material UI](https://mui.com/)



## Installation
1. Open the docker desktop application.
2. Navigate to "Add Extensions" in the left toolbar and click.
3. Search "Dockular" then click install. 



## Usage

1. Insructions for user to use our extension goes here



## Local development

You can use `docker` to build, install and push your extension. Also, we provide an opinionated [Makefile](Makefile) that could be convenient for you. There isn't a strong preference of using one over the other, so just use the one you're most comfortable with.

To build the extension, use `make build-extension` **or**:

```shell
  docker buildx build -t my/awesome-extension:latest . --load
```

To install the extension, use `make install-extension` **or**:

```shell
  docker extension install my/awesome-extension:latest
```

> If you want to automate this command, use the `-f` or `--force` flag to accept the warning message.

To preview the extension in Docker Desktop, open Docker Dashboard once the installation is complete. The left-hand menu displays a new tab with the name of your extension. You can also use `docker extension ls` to see that the extension has been installed successfully.



### Frontend development

During the development of the frontend part, it's helpful to use hot reloading to test your changes without rebuilding your entire extension. To do this, you can configure Docker Desktop to load your UI from a development server.
Assuming your app runs on the default port, start your UI app and then run:

```shell
  cd ui
  npm install
  npm run dev
```

This starts a development server that listens on port `3000`.

You can now tell Docker Desktop to use this as the frontend source. In another terminal run:

```shell
  docker extension dev ui-source my/awesome-extension:latest http://localhost:3000
```

In order to open the Chrome Dev Tools for your extension when you click on the extension tab, run:

```shell
  docker extension dev debug my/awesome-extension:latest
```

Each subsequent click on the extension tab will also open Chrome Dev Tools. To stop this behaviour, run:

```shell
  docker extension dev reset my/awesome-extension:latest
```



### Backend development (optional)

This example defines an API in Go that is deployed as a backend container when the extension is installed. This backend could be implemented in any language, as it runs inside a container. The extension frameworks provides connectivity from the extension UI to a socket that the backend has to connect to on the server side.

Note that an extension doesn't necessarily need a backend container, but in this example we include one for teaching purposes.

Whenever you make changes in the [backend](./backend) source code, you will need to compile them and re-deploy a new version of your backend container.
Use the `docker extension update` command to remove and re-install the extension automatically:

```shell
docker extension update my/awesome-extension:latest
```

> If you want to automate this command, use the `-f` or `--force` flag to accept the warning message.

> Extension containers are hidden from the Docker Dashboard by default. You can change this in Settings > Extensions > Show Docker Extensions system containers.




### Clean up

To remove the extension:

```shell
docker extension rm my/awesome-extension:latest
```



## Open Source Information

| Feature                                                                               | Status    |
|---------------------------------------------------------------------------------------|-----------|
| Pruning Dangling Images                                             | ✅        |
| Pruning Unused Images                                             | ✅        |
| Pruning Images in use                                             | ⏳        |
| Pruning Exited Containers                                             | ✅        |
| Pruning Running Containers       | ⏳        |
| Pruning Paused Containers                                                                         | ⏳        |
| Pruning Build Cache                                                                         | ⏳        |
| Scheduled Prune                                                                         | ⏳        |
| CPU Perent Metrics Visualization                                                                 | ✅        |
| RAM Perent Metrics Visualization                                                                         | ✅        |
| Setting RAM Hard Limits for Containers                                                             | ✅         |
| Setting CPU Limits for Containers                                         | ⏳        |


- ✅ = Ready to use
- ⏳ = In progress
- 🙏🏻 = Looking for contributors



## Contributing

We are always open to accepting any potential contributions, please feel free to check out our feature table for any ideas for potential features to contribute! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## License

Distributed under the MIT License. See [`LICENSE`](https://github.com/oslabs-beta/dockular/blob/main/LICENSE.md) for more information.

## Creators

* [Ando Agamalian](https://github.com/letscode94)
* [Alex Dawkins](https://github.com/aDawKN)
* [Darren Im](https://github.com/imdarren93)
* [Vishal Vivekanandan](https://github.com/vishalVivekanandan)


## Contact
GitHub: [https://github.com/oslabs-beta/dockular/](https://github.com/oslabs-beta/dockular/)

## Acknowledgements
