export const BACKLOG = 'backlog'
export const IN_PROGRESS = 'in_progress'
export const PR_REVIEW = 'pr_review'
export const TESTING = 'testing'
export const DONE = 'done'

export const listWithLabels = [
  { status: BACKLOG, label: 'Backlog' },
  { status: IN_PROGRESS, label: 'In Progress' },
  { status: PR_REVIEW, label: 'PR Review' },
  { status: TESTING, label: 'Testing' },
  { status: DONE, label: 'Done' },
]

export const list = listWithLabels.map(({ status }) => status)

export const labelMap = listWithLabels.reduce(
  (acc, { status, label }) => ({
    ...acc,
    [status]: label,
  }),
  {},
)

export const verify = status => (list.includes(status) ? status : null)
