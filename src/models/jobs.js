import job from './job';

const otherJobs = () => ({
  jobs: [],
});

export const addJob = (jobs, data) => {
  const nextJobs = [
    ...jobs.jobs,
    job(data)
  ];

  return {
    ...jobs,
    jobs: nextJobs,
  };
}

export default otherJobs;
