
<!-- PUT PROJECT'S LOGO ONCE DEV IS MERGED TO MAIN! -->

<br />
<p align="center">
  <a href="https://github.com/oslabs-beta/dockular">
    <img src="./ui/src/img/icon.png" alt="Logo" height="120">
  </a>

  <h3 align="center">Dockular</h3>

  <p align="center">
    An all in one solution that provides granular control over image pruning and container resource management.
    <br />
    <a href="https://github.com/oslabs-beta/dockular"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/oslabs-beta/dockular">Report Bug</a>
    ·
    <a href="https://github.com/oslabs-beta/dockular">Request Feature</a>
  </p>
</p>

<hr>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#The-Vision">About The Project</a>
      <ul>
        <li><a href="#Built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#Installation">Installation</a></li>
    </li>
    <li><a href="#open-source-information">Open Source Information</a></li>
    <li><a href="#enhancement-ideas">Enhancement Ideas</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#creators">Creators</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>
<hr>


## The Vision
Dockular is an open source product developed to combat the resource usage challenges of working with Docker. Our application is a docker desktop extension that currently provides two main features; Metrics and Prune.

Metric provides container CPU/RAM monitoring allowing users to montior individual container CPU and RAM usage. As needed the user can then set hard usage limits for each container.

Prune provides granular Control of image pruning and is accomplished by grouping images into categories such as "Dangling Images", "UnUsed Containers", and "Build Cache". The user can then select as many, or as little, individual images or entire categories to prune at the same time.


### Built With
* [Docker](https://www.docker.com/)
* [React](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Go](https://go.dev/)
* [Material UI](https://mui.com/)



## Installation
>NOTE: Product is currently in Beta, not all features are complete and bugs are expected.

Download link Here: [Dockular](https://drive.google.com/drive/folders/1VAEELfdDcVjEgaRteeRW07YudNLwSWb2).

Or following the instructions below:
1. Open the docker desktop application.
2. Navigate to "Add Extensions" in the left toolbar and click.
3. Search "Dockular" then click install. 



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
| Scheduled Prune                                                                         | 🙏🏻        |
| CPU Percent Metrics Visualization                                                                 | ✅        |
| RAM Percent Metrics Visualization                                                                         | ✅        |
| Setting RAM Hard Limits for Containers                                                             | ⏳         |
| Setting CPU Limits for Containers                                         | 🙏🏻        |

- ✅ = Ready to use
- ⏳ = In progress
- 🙏🏻 = Looking for contributors

## Enhancement Ideas
- Utilize Go to save pruned images/containers. Grant users the ability to visualize these containers/images within the datagrid by clicking a “Already pruned” button. This will allow the user to check if they accidentally pruned an image/container.
- When the user’s machine gets overwhelmed by large files saved locally and/or if they forget to prune docker containers, images and build cache for an extended period of time, their machine will experience system issues and the Dockular extension will not operate efficiently. This issue is due to the user reaching the limits to the machine’s storage capacity. Create an alert that warns the user that they are approaching maximum storage capacity. You can accomplish this by comparing the amount of local storage the user’s machine comes with, the amount of storage their local files are taking up, and lastly the amount of storage left available to utilize by Docker.
- The extension is not re-rendering when the user runs a command on their local machine. By accomplishing this task, the user will have the most up-to-date data on new containers, images, and build cache without having to click in and out of the prune section.
- Expand pruning capability for Docker Volumes, Logs, and Instances.




## Contributing

We are always open to accepting any potential contributions, please feel free to check out our feature table for any ideas for potential features to contribute! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## License

Distributed under the MIT License. See [`LICENSE`](https://github.com/oslabs-beta/dockular/blob/main/LICENSE.md) for more information.

## Meet the Team

Andranik Agamalian

[LinkedIn](https://www.linkedin.com/in/andranikagamalian/)
[Github](https://github.com/andranik-agamalian)

Alex Dawkins

[LinkedIn](https://www.linkedin.com/in/alex-dawkins-1718a92b1/)
[Github](https://github.com/aDawKN)

Darren Im

[LinkedIn](https://www.linkedin.com/in/imdarren93/)
[Github](https://github.com/imdarren93)

Vishal Vivekanandan

[LinkedIn](https://www.linkedin.com/in/vishal-vivekanandan-a6756b229/)
[Github](https://github.com/vishalVivekanandan)

## Contact
GitHub: [https://github.com/oslabs-beta/dockular/](https://github.com/oslabs-beta/dockular/)

## Acknowledgements
