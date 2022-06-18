using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AndcultureCode.GB.Tests.Testing.Enumerations;
using Docker.DotNet;
using Docker.DotNet.Models;

namespace AndcultureCode.GB.Tests.Testing.Containers
{
    public abstract class DockerContainerBase
    {
        #region Constants
        protected const string DEFAULT_PREFIX = "integration-testing-";
        private const int DELAY = 5500;

        #endregion Constants

        #region Member Variables

        private static string ContainerPrefix { get; set; }
        private string ContainerName { get; set; }
        private string ImageName { get; set; }
        private string TagName { get; set; }
        private ContainerStartAction StartAction { get; set; } = ContainerStartAction.None;

        #endregion Member Variables

        #region Constructor

        protected DockerContainerBase(string imageName, string containerName, string tagName = "latest", string prefix = DEFAULT_PREFIX)
        {
            ContainerName = containerName;
            ImageName = imageName;
            TagName = tagName;
            ContainerPrefix = prefix;
        }

        #endregion Constructor

        #region Public Methods

        public async Task Start(IDockerClient client)
        {
            if (StartAction != ContainerStartAction.None)
            {
                return;
            }

            var images = await client.Images.ListImagesAsync(
                 new ImagesListParameters
                 {
                     Filters = new Dictionary<string, IDictionary<string, bool>>
                     {
                         ["reference"] = new Dictionary<string, bool>
                         {
                             [$"{ImageName}:{TagName}"] = true
                         }
                     }
                 }
            );

            if (!images.Any())
            {
                await client.Images.CreateImageAsync(
                    parameters: new ImagesCreateParameters { FromImage = ImageName, Tag = TagName },
                    authConfig: null,
                    progress: new Progress<JSONMessage>()
                );
            }

            var listContainersResult = await client.Containers.ListContainersAsync(new ContainersListParameters
            {
                All = true
            });

            var container = listContainersResult.FirstOrDefault(x => x.Names.Contains($"/{ContainerName}"));

            if (container == null)
            {
                await CreateContainer(client);
            }
            else
            {
                if (container.State == "running")
                {
                    StartAction = ContainerStartAction.External;
                    return;
                }
            }

            var started = await client.Containers.StartContainerAsync(ContainerName, new ContainerStartParameters());
            if (!started)
            {
                throw new InvalidOperationException($"Container '{ContainerName}' did not start!!!!");
            }

            var i = 0;
            while (!await IsReady())
            {
                i++;

                if (i > 20)
                    throw new TimeoutException(
                        $"Container {ContainerName} does not seem to be responding in a timely manner");

                await Task.Delay(DELAY);
            }

        }
        public Task Remove(IDockerClient client)
        {
            return client.Containers.RemoveContainerAsync(
                id: ContainerName,
                parameters: new ContainerRemoveParameters { Force = true, RemoveVolumes = true }
            );
        }

        protected abstract Task<bool> IsReady();

        protected abstract HostConfig ToHostConfig();

        protected abstract Config ToConfig();

        public override string ToString()
        {
            return $"{nameof(ImageName)}: {ImageName}, {nameof(ContainerName)}: {ContainerName}";
        }

        public static async Task CleanupOrphanedContainers(DockerClient dockerClient, string prefix)
        {
            if (dockerClient.Containers == null)
            {
                return;
            }

            var containers = await dockerClient.Containers.ListContainersAsync(new ContainersListParameters
            {
                All = true
            });

            var orphanedContainers = containers.Where(c => c.Names.Any(n => n.Contains(prefix)));

            foreach (var container in orphanedContainers)
            {
                await dockerClient.Containers.RemoveContainerAsync(
                    id: container.ID,
                    parameters: new ContainerRemoveParameters { Force = true, RemoveVolumes = true }
                );
            }
        }

        #endregion Public Methods

        #region Private Methods

        private async Task CreateContainer(IDockerClient client)
        {
            var hostConfig = ToHostConfig();
            var config = ToConfig();

            await client.Containers.CreateContainerAsync(new CreateContainerParameters(config)
            {
                Image = $"{ImageName}:{TagName}",
                Name = ContainerName,
                Tty = true,
                HostConfig = hostConfig
            });
        }

        #endregion Private Methods

    }
}