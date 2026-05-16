import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const Tab = createBottomTabNavigator();

const colors = {
  background: '#F5F7FB',
  surface: '#FFFFFF',
  primary: '#1F3B73',
  secondary: '#3D7BFF',
  text: '#132043',
  muted: '#5C6B8A',
  border: '#E2E8F4',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
};

const kpis = [
  { label: 'Debris received', value: '182 tons', delta: '+12%' },
  { label: 'Paste volume', value: '4,120 m³', delta: '+4%' },
  { label: 'Active print jobs', value: '28', delta: '+3' },
  { label: 'Homes completed', value: '11', delta: '+2' },
  { label: 'Printer uptime', value: '96.4%', delta: '+0.8%' },
];

const criticalAlerts = [
  { title: 'Sterilizer #2 temp deviation', severity: 'High', age: '12m' },
  { title: 'Paste viscosity out of range', severity: 'Medium', age: '34m' },
  { title: 'Printer 07 nozzle clog risk', severity: 'High', age: '1h 10m' },
];

const stuckItems = [
  { title: 'Batch B-2041 stalled at QC', age: '4h 20m' },
  { title: 'Job P-332 awaiting paste', age: '2h 05m' },
  { title: 'Shipment S-991 pending intake', age: '1h 45m' },
];

const pipelineStages = [
  'Sorting',
  'Shred',
  'Sterilize',
  'Mix',
  'QC',
];

const pipelineBatches = {
  Sorting: [
    { id: 'B-2088', status: 'Queued', age: '48m', flag: 'Contamination' },
    { id: 'B-2091', status: 'In progress', age: '22m' },
  ],
  Shred: [
    { id: 'B-2074', status: 'In progress', age: '31m' },
    { id: 'B-2079', status: 'Queued', age: '54m' },
  ],
  Sterilize: [
    { id: 'B-2056', status: 'In progress', age: '18m' },
    { id: 'B-2059', status: 'Queued', age: '41m' },
  ],
  Mix: [
    { id: 'B-2033', status: 'Queued', age: '1h 02m' },
    { id: 'B-2037', status: 'In progress', age: '27m' },
  ],
  QC: [
    { id: 'B-2028', status: 'Review', age: '2h 14m', flag: 'Viscosity' },
    { id: 'B-2029', status: 'Review', age: '1h 38m' },
  ],
};

const printJobs = [
  { id: 'P-338', plan: 'Plan A', status: 'Printing', eta: '2h 40m', printer: 'Printer 02' },
  { id: 'P-341', plan: 'Plan B', status: 'Queued', eta: '4h 10m', printer: 'Printer 05' },
  { id: 'P-342', plan: 'Plan C', status: 'Paused', eta: '—', printer: 'Printer 07' },
];

const printers = [
  { id: 'Printer 02', status: 'Active', temp: '210°C', flow: '98%', deviation: '0.6mm' },
  { id: 'Printer 05', status: 'Idle', temp: '195°C', flow: '0%', deviation: '—' },
  { id: 'Printer 07', status: 'Maintenance', temp: '205°C', flow: '12%', deviation: '1.4mm' },
];

const inventoryItems = [
  { name: 'Raw debris', onHand: '380 tons', min: '240 tons', days: '6.4' },
  { name: 'Processed paste', onHand: '4,120 m³', min: '3,000 m³', days: '4.1' },
  { name: 'Nozzles', onHand: '42', min: '25', days: '18' },
  { name: 'Filter media', onHand: '88', min: '60', days: '12' },
];

const alerts = {
  Active: [
    { title: 'Low paste buffer', severity: 'High', time: '8m', area: 'Mix' },
    { title: 'Printer 07 vibration', severity: 'Medium', time: '22m', area: 'Prints' },
  ],
  Acknowledged: [
    { title: 'Inbound batch delayed', severity: 'Low', time: '1h 12m', area: 'Intake' },
  ],
  Resolved: [
    { title: 'Sterilizer #1 calibration', severity: 'Medium', time: 'Yesterday', area: 'Sterilize' },
  ],
};

const moreModules = [
  { title: 'Workforce', detail: 'Roster, certifications, utilization' },
  { title: 'Compliance', detail: 'Audit logs, QC summaries' },
  { title: 'Reports', detail: 'Export CSV/PDF for partners' },
  { title: 'Settings', detail: 'Thresholds, alerts, access' },
];

function AppShell() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            borderTopColor: colors.border,
            backgroundColor: colors.surface,
          },
          tabBarLabelStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen name="Overview" component={OverviewScreen} />
        <Tab.Screen name="Pipeline" component={PipelineScreen} />
        <Tab.Screen name="Prints" component={PrintsScreen} />
        <Tab.Screen name="Inventory" component={InventoryScreen} />
        <Tab.Screen name="Alerts" component={AlertsScreen} />
        <Tab.Screen name="More" component={MoreScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function ScreenWrapper({ children }) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>{children}</ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function KpiCard({ label, value, delta }) {
  return (
    <Card style={styles.kpiCard}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiDelta}>{delta}</Text>
    </Card>
  );
}

function Tag({ text, variant }) {
  const background = {
    High: colors.danger,
    Medium: colors.warning,
    Low: colors.success,
  }[variant] || colors.secondary;
  return (
    <View style={[styles.tag, { backgroundColor: background }]}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected ? styles.chipActive : styles.chipInactive,
      ]}
    >
      <Text style={selected ? styles.chipTextActive : styles.chipTextInactive}>
        {label}
      </Text>
    </Pressable>
  );
}

function OverviewScreen() {
  return (
    <ScreenWrapper>
      <Text style={styles.pageTitle}>Operations Overview</Text>
      <Text style={styles.pageSubtitle}>Warehouse 04 · Today</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiRow}>
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </ScrollView>

      <SectionHeader title="Trends" action="Last 7 days" />
      <View style={styles.chartRow}>
        <Card style={[styles.chartCard, styles.chartCardLeft]}>
          <Text style={styles.chartTitle}>Throughput</Text>
          <View style={styles.chartPlaceholder}>
            <View style={[styles.chartBar, { width: '70%' }]} />
            <View style={[styles.chartBar, { width: '55%' }]} />
            <View style={[styles.chartBar, { width: '80%' }]} />
            <View style={[styles.chartBar, { width: '62%' }]} />
          </View>
        </Card>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Downtime</Text>
          <View style={styles.chartPlaceholder}>
            <View style={[styles.chartBar, { width: '40%' }]} />
            <View style={[styles.chartBar, { width: '52%' }]} />
            <View style={[styles.chartBar, { width: '30%' }]} />
            <View style={[styles.chartBar, { width: '46%' }]} />
          </View>
        </Card>
      </View>

      <SectionHeader title="Critical alerts" action="View all" />
      {criticalAlerts.map((alert) => (
        <Card key={alert.title} style={styles.listRow}>
          <View>
            <Text style={styles.listTitle}>{alert.title}</Text>
            <Text style={styles.listMeta}>Age {alert.age}</Text>
          </View>
          <Tag text={alert.severity} variant={alert.severity} />
        </Card>
      ))}

      <SectionHeader title="Stuck items" action="Resolve" />
      {stuckItems.map((item) => (
        <Card key={item.title} style={styles.listRow}>
          <View>
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text style={styles.listMeta}>Age {item.age}</Text>
          </View>
          <Text style={styles.listAction}>Review</Text>
        </Card>
      ))}
    </ScreenWrapper>
  );
}

function PipelineScreen() {
  const [stage, setStage] = useState(pipelineStages[0]);
  const batches = useMemo(() => pipelineBatches[stage] || [], [stage]);

  return (
    <ScreenWrapper>
      <Text style={styles.pageTitle}>Pre-processing Pipeline</Text>
      <Text style={styles.pageSubtitle}>Live queues & throughput</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {pipelineStages.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={item === stage}
            onPress={() => setStage(item)}
          />
        ))}
      </ScrollView>

      <Card style={styles.stageSummary}>
        <Text style={styles.stageTitle}>{stage}</Text>
        <Text style={styles.stageMeta}>Queue 6 · WIP 12 · 48 units/hr · +4%</Text>
      </Card>

      <SectionHeader title="Batches" action="Reassign" />
      {batches.map((batch) => (
        <Card key={batch.id} style={styles.listRow}>
          <View>
            <Text style={styles.listTitle}>{batch.id}</Text>
            <Text style={styles.listMeta}>
              {batch.status} · Age {batch.age}
            </Text>
            {batch.flag ? (
              <Text style={styles.flagText}>Flag: {batch.flag}</Text>
            ) : null}
          </View>
          <Text style={styles.listAction}>Details</Text>
        </Card>
      ))}
    </ScreenWrapper>
  );
}

function PrintsScreen() {
  const [viewMode, setViewMode] = useState('Jobs');
  const list = viewMode === 'Jobs' ? printJobs : printers;

  return (
    <ScreenWrapper>
      <Text style={styles.pageTitle}>3D Printing Ops</Text>
      <Text style={styles.pageSubtitle}>Jobs and printer telemetry</Text>

      <View style={styles.segmented}>
        {['Jobs', 'Printers'].map((item) => (
          <Pressable
            key={item}
            onPress={() => setViewMode(item)}
            style={[
              styles.segment,
              viewMode === item ? styles.segmentActive : styles.segmentInactive,
            ]}
          >
            <Text
              style={viewMode === item ? styles.segmentTextActive : styles.segmentText}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      {list.map((item) => (
        <Card key={item.id} style={styles.printCard}>
          <View style={styles.printHeader}>
            <Text style={styles.listTitle}>{item.id}</Text>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          {viewMode === 'Jobs' ? (
            <Text style={[styles.listMeta, styles.printMeta]}>
              {item.plan} · {item.printer} · ETA {item.eta}
            </Text>
          ) : (
            <Text style={[styles.listMeta, styles.printMeta]}>
              Temp {item.temp} · Flow {item.flow} · Deviation {item.deviation}
            </Text>
          )}
          <View style={styles.actionRow}>
            <Text style={styles.actionLink}>Pause</Text>
            <Text style={styles.actionLink}>Resume</Text>
            <Text style={styles.actionLink}>Maintenance</Text>
          </View>
        </Card>
      ))}
    </ScreenWrapper>
  );
}

function InventoryScreen() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Raw', 'Paste', 'Consumables', 'Parts'];

  return (
    <ScreenWrapper>
      <Text style={styles.pageTitle}>Inventory</Text>
      <Text style={styles.pageSubtitle}>Stock levels & reorder points</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {filters.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={item === filter}
            onPress={() => setFilter(item)}
          />
        ))}
      </ScrollView>

      <Card style={styles.alertBanner}>
        <Text style={styles.alertTitle}>Low stock warning</Text>
        <Text style={styles.alertText}>Paste buffer projected under 3 days.</Text>
      </Card>

      {inventoryItems.map((item) => (
        <Card key={item.name} style={styles.listRow}>
          <View>
            <Text style={styles.listTitle}>{item.name}</Text>
            <Text style={styles.listMeta}>
              On hand {item.onHand} · Min {item.min}
            </Text>
          </View>
          <Text style={styles.listAction}>{item.days} days</Text>
        </Card>
      ))}

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Create restock request</Text>
      </Pressable>
    </ScreenWrapper>
  );
}

function AlertsScreen() {
  const [tab, setTab] = useState('Active');
  const list = alerts[tab];

  return (
    <ScreenWrapper>
      <Text style={styles.pageTitle}>Alerts & Incidents</Text>
      <Text style={styles.pageSubtitle}>Escalations and corrective actions</Text>

      <View style={styles.segmented}>
        {['Active', 'Acknowledged', 'Resolved'].map((item) => (
          <Pressable
            key={item}
            onPress={() => setTab(item)}
            style={[
              styles.segment,
              tab === item ? styles.segmentActive : styles.segmentInactive,
            ]}
          >
            <Text style={tab === item ? styles.segmentTextActive : styles.segmentText}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      {list.map((item) => (
        <Card key={item.title} style={styles.listRow}>
          <View>
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text style={styles.listMeta}>
              {item.area} · {item.time}
            </Text>
          </View>
          <Tag text={item.severity} variant={item.severity} />
        </Card>
      ))}

      <View style={styles.actionRow}>
        <Text style={styles.actionLink}>Acknowledge</Text>
        <Text style={styles.actionLink}>Escalate</Text>
        <Text style={styles.actionLink}>Add note</Text>
      </View>
    </ScreenWrapper>
  );
}

function MoreScreen() {
  return (
    <ScreenWrapper>
      <Text style={styles.pageTitle}>Administration</Text>
      <Text style={styles.pageSubtitle}>Teams, compliance, reporting</Text>

      {moreModules.map((item) => (
        <Card key={item.title} style={styles.listRow}>
          <View>
            <Text style={styles.listTitle}>{item.title}</Text>
            <Text style={styles.listMeta}>{item.detail}</Text>
          </View>
          <Text style={styles.listAction}>Open</Text>
        </Card>
      ))}
    </ScreenWrapper>
  );
}

export default function App() {
  return <AppShell />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  pageSubtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 14,
    color: colors.muted,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sectionAction: {
    color: colors.secondary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  kpiRow: {
    marginBottom: 8,
  },
  kpiCard: {
    width: 160,
    marginRight: 12,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  kpiLabel: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
  },
  kpiDelta: {
    marginTop: 8,
    fontWeight: '600',
    color: colors.success,
  },
  chartRow: {
    flexDirection: 'row',
  },
  chartCard: {
    flex: 1,
  },
  chartCardLeft: {
    marginRight: 12,
  },
  chartTitle: {
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  chartPlaceholder: {},
  chartBar: {
    height: 8,
    backgroundColor: colors.secondary,
    borderRadius: 4,
    marginBottom: 8,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  listMeta: {
    marginTop: 6,
    fontSize: 12,
    color: colors.muted,
  },
  listAction: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  chipRow: {
    marginBottom: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipInactive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  chipTextInactive: {
    color: colors.muted,
    fontWeight: '600',
  },
  stageSummary: {
    marginTop: 8,
    marginBottom: 8,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  stageMeta: {
    marginTop: 6,
    color: colors.muted,
  },
  flagText: {
    marginTop: 6,
    fontSize: 12,
    color: colors.danger,
    fontWeight: '600',
  },
  segmented: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentInactive: {
    backgroundColor: 'transparent',
  },
  segmentText: {
    color: colors.muted,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  printCard: {},
  printMeta: {
    marginTop: 6,
  },
  printHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontWeight: '600',
    color: colors.primary,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionLink: {
    color: colors.secondary,
    fontWeight: '600',
    marginRight: 18,
  },
  alertBanner: {
    backgroundColor: '#FFF4E5',
    borderColor: '#FAD7A0',
  },
  alertTitle: {
    fontWeight: '700',
    color: colors.text,
  },
  alertText: {
    marginTop: 6,
    color: colors.muted,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
