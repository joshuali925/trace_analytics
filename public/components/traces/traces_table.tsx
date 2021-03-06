import {
  EuiButtonIcon,
  EuiCopy,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
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

export function TracesTable(props: { items: any[] }) {
  const renderTitleBar = (totalItems?: number) => {
    return (
      <EuiFlexGroup alignItems="center" gutterSize="s">
        <EuiFlexItem grow={10}>
          <PanelTitle title="Traces" totalItems={totalItems} />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  };

  const columns = useMemo(
    () =>
      [
        {
          field: 'trace_id',
          name: 'Trace ID',
          align: 'left',
          sortable: true,
          truncateText: true,
          render: (item) => (
            <EuiFlexGroup gutterSize="s" alignItems="center">
              <EuiFlexItem grow={10}>
                <EuiLink href={`#/traces/${encodeURIComponent(item)}`}>
                  {_.truncate(item, { length: 24 })}
                </EuiLink>
              </EuiFlexItem>
              <EuiFlexItem grow={5}>
                <EuiCopy textToCopy={item}>
                  {(copy) => (
                    <EuiButtonIcon
                      aria-label="Copy trace id"
                      iconType="copyClipboard"
                      onClick={copy}
                    >
                      Click to copy
                    </EuiButtonIcon>
                  )}
                </EuiCopy>
              </EuiFlexItem>
            </EuiFlexGroup>
          ),
        },
        {
          field: 'trace_group',
          name: 'Trace group',
          align: 'left',
          sortable: true,
          truncateText: true,
          render: (item) => <EuiText size="s">{_.truncate(item, { length: 24 })}</EuiText>,
        },
        {
          field: 'latency',
          name: 'Latency (ms)',
          align: 'right',
          sortable: true,
          truncateText: true,
        },
        {
          field: 'percentile_in_trace_group',
          name: (
            <>
              <div>Percentile in trace group</div>
              {/* <div style={{ marginRight: 5 }}>trace group</div> */}
            </>
          ),
          align: 'right',
          sortable: true,
          render: (item) =>
            item === 0 || item ? <EuiText size="s">{`${_.round(item, 2)}th`}</EuiText> : '-',
        },
        {
          field: 'error_count',
          name: 'Errors',
          align: 'right',
          sortable: true,
          render: (item) => (item === 0 || item ? item : '-'),
        },
        {
          field: 'last_updated',
          name: 'Last updated',
          align: 'left',
          sortable: true,
          render: (item) => (item === 0 || item ? item : '-'),
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
                field: 'trace_id',
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
