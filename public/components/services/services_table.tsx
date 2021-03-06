import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiI18nNumber,
  EuiInMemoryTable,
  EuiLink,
  EuiPanel,
  EuiSpacer,
  EuiTableFieldDataColumnType,
  EuiText,
} from '@elastic/eui';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { NoMatchMessage, PanelTitle } from '../common';
import { FilterType } from '../common/filters/filters';

export function ServicesTable(props: {
  items: any[];
  addFilter: (filter: FilterType) => void;
  setRedirect: (redirect: boolean) => void;
}) {
  const renderTitleBar = (totalItems?: number) => {
    return (
      <EuiFlexGroup alignItems="center" gutterSize="s">
        <EuiFlexItem grow={10}>
          <PanelTitle title="Services" totalItems={totalItems} />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  };

  const columns = useMemo(
    () =>
      [
        {
          field: 'name',
          name: 'Name',
          align: 'left',
          sortable: true,
          render: (item) => (
            <EuiLink href={`#/services/${encodeURIComponent(item)}`}>
              {_.truncate(item, { length: 24 })}
            </EuiLink>
          ),
        },
        {
          field: 'average_latency',
          name: 'Average latency (ms)',
          align: 'right',
          sortable: true,
          render: (item) => (item === 0 || item ? _.round(item, 2) : '-'),
        },
        {
          field: 'error_rate',
          name: 'Error rate',
          align: 'right',
          sortable: true,
          render: (item) =>
            item === 0 || item ? <EuiText size="s">{`${_.round(item, 2)}%`}</EuiText> : '-',
        },
        {
          field: 'throughput',
          name: 'Throughput',
          align: 'right',
          sortable: true,
          truncateText: true,
          render: (item) => (item === 0 || item ? <EuiI18nNumber value={item} /> : '-'),
        },
        {
          field: 'number_of_connected_services',
          name: 'No. of connected services',
          align: 'right',
          sortable: true,
          truncateText: true,
          width: '80px',
          render: (item) => (item === 0 || item ? item : '-'),
        },
        {
          field: 'connected_services',
          name: 'Connected services',
          align: 'left',
          sortable: true,
          truncateText: true,
          render: (item) =>
            item ? <EuiText size="s">{_.truncate(item, { length: 50 })}</EuiText> : '-',
        },
        {
          field: 'traces',
          name: 'Traces',
          align: 'right',
          sortable: true,
          truncateText: true,
          render: (item, row) => (
            <EuiLink
              onClick={() => {
                props.setRedirect(true);
                props.addFilter({
                  field: 'serviceName',
                  operator: 'is',
                  value: row.name,
                  inverted: false,
                  disabled: false,
                });
                location.assign('#/traces');
              }}
            >
              <EuiI18nNumber value={item} />
            </EuiLink>
          ),
        },
      ] as Array<EuiTableFieldDataColumnType<any>>,
    [props.items]
  );

  const titleBar = useMemo(() => renderTitleBar(props.items?.length), [props.items]);

  return (
    <>
      <EuiPanel>
        {titleBar}
        <EuiSpacer size="m" />
        <EuiHorizontalRule margin="none" />
        {props.items?.length > 0 ? (
          <EuiInMemoryTable
            tableLayout="auto"
            items={props.items}
            columns={columns}
            pagination={{
              initialPageSize: 10,
              pageSizeOptions: [5, 10, 15],
            }}
            sorting={{
              sort: {
                field: 'name',
                direction: 'asc',
              },
            }}
          />
        ) : (
          <NoMatchMessage size="xl" />
        )}
      </EuiPanel>
    </>
  );
}
