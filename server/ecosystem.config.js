module.export = {
  apps: [
    {
      name: "project-management",
      Script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
