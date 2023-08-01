// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.
import { nodes, root, state } from "membrane";

export async function configure({ args: { audienceId, tableId }}) {
  const audience = await nodes.audiences.one({ id: audienceId });
  await audience.subscriptions.$subscribe(root.handleEvent);

  // save the gref of the table to state
  state.table = nodes.tables.one({ id: tableId });
}

export async function handleEvent({ event }) {
  const data = await event.member.$query(
    `{ email_address, status, timestamp_opt }`
  );

  const record = {
    email: data.email_address,
    status: data.status,
    timestamp: data.timestamp_opt,
  };
  await state.table.createRecord({ fields: record });
}
