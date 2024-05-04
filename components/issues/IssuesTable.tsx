'use client';

import { priorities, statuses } from '@/config/constants';
import { Issue, User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import CustomAvatar from '../CustomAvatar';
import { DataTable } from '../ui/data-table';

const columns: ColumnDef<
  Issue & {
    assignee: User;
  }
>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label='Select all'
  //       className='translate-y-[2px]'
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={value => row.toggleSelected(!!value)}
  //       aria-label='Select row'
  //       className='translate-y-[2px]'
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'id',
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title='Task' />
    // ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title='Title' />
    // ),
    // cell: ({ row }) => {
    //   const label = labels.find(label => label.value === row.original.label);

    //   return (
    //     <div className='flex space-x-2'>
    //       {label && <Badge variant='outline'>{label.label}</Badge>}
    //       <span className='max-w-[500px] truncate font-medium'>
    //         {row.getValue('title')}
    //       </span>
    //     </div>
    //   );
    // },
  },
  {
    accessorKey: 'status',
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title='Status' />
    // ),
    cell: ({ row }) => {
      const status = statuses.find(
        status => status.value === row.getValue('status')
      );

      if (!status) {
        return null;
      }

      return (
        <div className='flex w-[100px] items-center'>
          {status.icon && (
            <div className='*:mr-2 *:h-4 *:w-4 *:text-muted-foreground'>
              {status.icon}
            </div>
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'priority',
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title='Priority' />
    // ),
    cell: ({ row }) => {
      const priority = priorities.find(
        priority => priority.value === row.getValue('priority')
      );

      if (!priority) {
        return null;
      }

      return (
        <div className='flex items-center'>
          {priority.icon && (
            <div className='*:mr-2 *:h-4 *:w-4 *:text-muted-foreground'>
              {priority.icon}
            </div>
          )}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'assignee',
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title='Priority' />
    // ),
    cell: ({ row }) => {
      const assignee: User = row.getValue('assignee');

      return (
        <CustomAvatar
          src={assignee.image}
          name={assignee.email}
          className='w-6 h-6'
        />
      );
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];

const navigateBy: keyof Issue = 'id';

export default function IssuesTable({
  issues,
}: {
  issues: (Issue & {
    assignee: User;
  })[];
}) {
  const workspaceId = issues[0]?.workspaceId;

  return (
    <DataTable
      data={issues}
      columns={columns}
      navigateTo={`/workspace/${workspaceId}/issues`}
      navigateBy={navigateBy}
    />
  );
}
