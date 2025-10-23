import { StyleSheet, Text, View, FlatList, useColorScheme, ScrollView, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CircularLoadingDots from "../utils/CircularLoadingDots";
import { Dropdown } from "react-native-element-dropdown";

const BLOContactDetails = (props) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const columnWidths = {
    slno: 80,
    name: 120,
    role: 150,
    mobile: 130,
    district: 120,
    assembly: 120,
  };

  const totalTableWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);

  const isValidRole =
    props.roleDataOptions?.some(
      (option) => String(option.value) === String(props.roleData)
    ) ?? false;

  const isValidDistrcit =
    props.districtOptions?.some(
      (option) => String(option.value) === String(props.district)
    ) ?? false;

  const isValidAssembly =
    props.assemblyOptions?.some(
      (option) => String(option.value) === String(props.assembly)
    ) ?? false;

  const isValidPart =
    props.partOptions?.some(
      (option) => String(option.value) === String(props.part)
    ) ?? false;

  if (props.loading) {
    return (
      <View style={styles.loaderOverlay}>
        <CircularLoadingDots
          size={12}
          color="#d86060ff"
          dotCount={6}
          animationType="rotate"
          circleSize={80}
        />
        <Text style={{ color: "#fff", marginTop: 12, fontWeight: "600" }}>
          Loading data...
        </Text>
      </View>
    );
  }

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, { width: columnWidths.slno }]}>Sl. No</Text>
      <Text style={[styles.headerCell, { width: columnWidths.name }]}>Name</Text>
      <Text style={[styles.headerCell, { width: columnWidths.role }]}>Role / PartNo</Text>
      <Text style={[styles.headerCell, { width: columnWidths.mobile }]}>Mobile No</Text>
      <Text style={[styles.headerCell, { width: columnWidths.district }]}>District</Text>
      <Text style={[styles.headerCell, { width: columnWidths.assembly }]}>Assembly</Text>
    </View>
  );

  const TableRow = ({ item, index }) => (
    <View style={[
      styles.tableRow,
      index % 2 === 0 ? styles.evenRow : styles.oddRow
    ]}>
      <Text style={[styles.cell, { width: columnWidths.slno }]}>{index + 1}</Text>
      <Text style={[styles.cell, { width: columnWidths.name }]}>{item.name || '-'}</Text>
      <Text style={[styles.cell, { width: columnWidths.role }]}>{item.role || '-'}</Text>
      <Text style={[styles.cell, { width: columnWidths.mobile }]}>{item.mobileNumber || '-'}</Text>
      <Text style={[styles.cell, { width: columnWidths.district }]}>{item.dist_name || '-'}</Text>
      <Text style={[styles.cell, { width: columnWidths.assembly }]}>{item.ac_name || '-'}</Text>
    </View>
  );

  const renderDropdowns = () => (
    <View style={styles.dropdownsContainer}>
      <View style={styles.card}>
        <Text style={styles.label}>Select Role</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={props.roleDataOptions || []}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select role"
          searchPlaceholder="Search..."
          keyboardAvoiding={true}
          autoScroll={false}
          value={isValidRole ? props.roleData : null}
          onChange={(item) => {
            props.setRoleData(item.value);
            props.setDistrict(null);
            props.setAssembly(null);
            props.setPart(null);
            props.setContactDetails([]);
          }}
          renderRightIcon={() => (
            <Icon
              name="arrow-drop-down"
              size={30}
              color={isDark ? "#2f2085ff" : "#333"}
            />
          )}
          dropdownPosition="auto"
          containerStyle={styles.dropdownContainer}
        />
      </View>

      {props.roleData && (
        <View style={styles.card}>
          <Text style={styles.label}>Select District</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={props.districtOptions || []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select district"
            searchPlaceholder="Search..."
            keyboardAvoiding={true}
            autoScroll={false}
            value={isValidDistrcit ? props.district : null}
            onChange={(item) => {
              props.setDistrict(item.value);
              props.setAssembly(null);
              props.setPart(null);
              props.setContactDetails([]);
            }}
            renderRightIcon={() => (
              <Icon
                name="arrow-drop-down"
                size={30}
                color={isDark ? "#2f2085ff" : "#333"}
              />
            )}
            dropdownPosition="auto"
            containerStyle={styles.dropdownContainer}
          />
        </View>
      )}

      {props.roleData && props.district && props.roleData !== "5" && (
        <View style={styles.card}>
          <Text style={styles.label}>Select Assembly</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={props.assemblyOptions || []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select assembly"
            searchPlaceholder="Search..."
            keyboardAvoiding={true}
            autoScroll={false}
            value={isValidAssembly ? props.assembly : null}
            onChange={(item) => {
              props.setAssembly(item.value);
              props.setPart(null);
              props.setContactDetails([]);
            }}
            renderRightIcon={() => (
              <Icon
                name="arrow-drop-down"
                size={30}
                color={isDark ? "#2f2085ff" : "#333"}
              />
            )}
            dropdownPosition="auto"
            containerStyle={styles.dropdownContainer}
          />
        </View>
      )}

      {props.roleData !== "5" && props.assembly && props.roleData !== "4" && props.roleData !== "3" && (
        <View style={styles.card}>
          <Text style={styles.label}>Select Part</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={props.partOptions || []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select part"
            searchPlaceholder="Search..."
            keyboardAvoiding={true}
            autoScroll={false}
            value={isValidPart ? props.part : null}
            onChange={(item) => {
              props.setPart(item.value);
              props.setContactDetails([]);
            }}
            renderRightIcon={() => (
              <Icon
                name="arrow-drop-down"
                size={30}
                color={isDark ? "#2f2085ff" : "#333"}
              />
            )}
            dropdownPosition="auto"
            containerStyle={styles.dropdownContainer}
          />
        </View>
      )}
    </View>
  );

  const renderTableContent = () => {
    if (!props.roleData) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            ℹ️ Please select a role to load contact details
          </Text>
        </View>
      );
    }

    if (props.contactDetails?.length === 0) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>⚠️ Data unavailable!</Text>
        </View>
      );
    }

    return (
      <View style={styles.tableWrapper}>
        {/* Horizontal Scroll Container */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          <View style={[styles.tableContainer, { width: totalTableWidth }]}>
            {/* Fixed Header */}
            <TableHeader />
            
            {/* Scrollable Rows */}
            <FlatList
              data={props.contactDetails}
              renderItem={({ item, index }) => <TableRow item={item} index={index} />}
              keyExtractor={(item, index) => item.h_id?.toString() || index.toString()}
              showsVerticalScrollIndicator={true}
              initialNumToRender={15}
              maxToRenderPerBatch={20}
              windowSize={10}
              removeClippedSubviews={false}
              style={styles.verticalFlatList}
            />
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Section */}
      <View style={styles.dropdownsWrapper}>
        {renderDropdowns()}
      </View>

      {/* Table Section */}
      <View style={styles.tableSection}>
        {renderTableContent()}
      </View>
    </View>
  );
};

export default BLOContactDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  dropdownsWrapper: {
    zIndex: 10000,
    elevation: 10000,
  },
  dropdownsContainer: {
    padding: 8,
  },
  tableSection: {
    flex: 1,
    marginTop: 8,
  },
  tableWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 8,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  horizontalScrollContent: {
    flexGrow: 1,
  },
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#89a6d1ff",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#7189b9',
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 4,
    minHeight: 50,
    alignItems: 'center',
  },
  evenRow: {
    backgroundColor: "#fafafa",
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
  headerCell: {
    fontWeight: "700",
    fontSize: 14,
    color: "#1a237e",
    textAlign: "center",
    paddingHorizontal: 2,
  },
  cell: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 2,
    flexWrap: 'wrap',
  },
  verticalFlatList: {
    flex: 1,
  },
  emptyCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    marginHorizontal: 20,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  dropdown: {
    height: 50,
    borderColor: "#d1d5db",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginTop: 4,
    width: '100%',
    zIndex: 10001,
  },
  dropdownContainer: {
    zIndex: 10002,
    elevation: 10002,
    borderRadius: 10,
  },
  placeholderStyle: {
    fontSize: 15,
    color: "#6b7280",
  },
  selectedTextStyle: {
    fontSize: 15,
    color: "#111827",
    fontWeight: '500',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    color: "#111827",
    borderRadius: 8,
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});