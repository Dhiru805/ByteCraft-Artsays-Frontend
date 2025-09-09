import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import postAPI from '../../../../../api/postAPI'

const permissions = ['View', 'Create', 'Edit', 'Delete'];

const sidebar = [
  { tab: 'DashBoard', tabId: 'dbd1', icon: 'fa-dashboard', subtab: [] },
  { tab: 'Admin', tabId: 'adn1', icon: 'fas fa-user', subtab: [] },
  { tab: 'Blogs', tabId: 'bgs1', icon: 'fa fa-newspaper', subtab: [] },
  {
    tab: 'Artist', tabId: 'att1',
    icon: 'fa fa-paint-brush',
    subtab: [
      { label: 'Management', subtabId: 'att11' },
      { label: 'Blog Request', subtabId: 'att12' },
      { label: 'Blogs', subtabId: 'att13' },
      { label: 'Product Request', subtabId: 'att14' },
      { label: 'Products', subtabId: 'att15' },
      { label: 'Sold Product', subtabId: 'att16' },
    ],
  },
  {
    tab: 'Buyer', tabId: 'byr1',
    icon: 'fa-handshake',
    subtab: [
      { label: 'Management', subtabId: 'byr11' },
      { label: 'Product Purchased', subtabId: 'byr12' },
      { label: 'Resell Product Request', subtabId: 'byr13' },
      { label: 'Sold Product', subtabId: 'byr14' },
    ],
  },
  {
    tab: 'Seller', tabId: 'slr1',
    icon: 'fa fa-tag',
    subtab: [
      { label: 'Management', subtabId: 'slr11' },
      { label: 'Products', subtabId: 'slr12' },
      { label: 'Product Request', subtabId: 'slr13' },
      { label: 'Sold Product', subtabId: 'slr14' },
    ],
  },
  { tab: 'Product', tabId: 'pdt1', icon: 'fa fa-cart-plus', subtab: [] },
  { tab: 'Custom Order', tabId: 'cor1', icon: 'fa fa-cart-plus', subtab: [] },
  { tab: 'Product Purchased', tabId: 'ptp1', icon: 'fa fa-cart-plus', subtab: [] },
  {
    tab: 'Bidding', tabId: 'bdg1',
    icon: 'fa fa-gavel',
    subtab: [
      { label: 'All Products', subtabId: 'bdg11' },
      { label: 'Bidded Product', subtabId: 'bdg12' },
      { label: 'Bidding Pass', subtabId: 'bdg13' },
    ],
  },
  { tab: 'Certification Services', tabId: 'csv1', icon: 'fa fa-certificate', subtab: [] },
  { tab: 'Sponsor', tabId: 'spr1', icon: 'fa fa-bullhorn', subtab: [] },
  {
    tab: 'Settings', tabId: 'stg1',
    icon: 'fa fa-cog',
    subtab: [
      { label: 'Product Category', subtabId: 'stg11' },
      { label: 'Blog Category', subtabId: 'stg12' },
      { label: 'Email Setting', subtabId: 'stg13' },
      { label: 'Marketing', subtabId: 'stg14' },
      { label: 'User Role', subtabId: 'stg15' },
    ],
  },

];

const CreateRole = () => {
  const [roleName, setRoleName] = useState('');
  const [selectedModules, setSelectedModules] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleRoleNameChange = (e) => setRoleName(e.target.value);

  const location = useLocation();
  const roleData = location.state?.roleData || null;

  useEffect(() => {
    if (roleData) {
      setRoleName(roleData.role);

      const preSelectedModules = {};

      roleData.tabs.forEach(tab => {
        const tabKey = tab.title;

        if (tab.subTabs && tab.subTabs.length > 0) {
          tab.subTabs.forEach(sub => {
            const subKey = `${tabKey}__${sub.title}`;
            preSelectedModules[subKey] = {
              View: sub.permissions.view,
              Create: sub.permissions.create,
              Edit: sub.permissions.edit,
              Delete: sub.permissions.delete,
            };
          });

          const anySubPermission = tab.subTabs.some(
            (sub) => Object.values(sub.permissions).some(Boolean)
          );

          if (anySubPermission) {
            preSelectedModules[tabKey] = {
              View: true,
              Create: true,
              Edit: true,
              Delete: true
            };
          }

        } else {
          preSelectedModules[tabKey] = {
            View: tab.permissions?.view || false,
            Create: tab.permissions?.create || false,
            Edit: tab.permissions?.edit || false,
            Delete: tab.permissions?.delete || false,
          };
        }
      });

      setSelectedModules(preSelectedModules);
    }
  }, [roleData]);



  const handleModuleToggle = (label, parentTab = null) => {
    setSelectedModules((prev) => {
      const newSelected = { ...prev };
      const key = parentTab ? `${parentTab}__${label}` : label;
      const isChecked = !!newSelected[key];

      if (isChecked) {
        delete newSelected[key];
      } else {
        newSelected[key] = {
          View: true,
          Create: true,
          Edit: true,
          Delete: true
        };
      }

      if (!parentTab) {
        const foundTab = sidebar.find(item => item.tab === label);
        if (foundTab?.subtab?.length > 0) {
          foundTab.subtab.forEach(({ label: subLabel }) => {
            const subKey = `${label}__${subLabel}`;
            if (isChecked) {
              delete newSelected[subKey];
            } else {
              newSelected[subKey] = {
                View: true,
                Create: true,
                Edit: true,
                Delete: true
              };
            }
          });
        }
      }

      if (parentTab) {
        const parentTabItem = sidebar.find((item) => item.tab === parentTab);
        const isAnySubtabChecked = parentTabItem.subtab.some(({ label: subLabel }) => {
          const subKey = `${parentTab}__${subLabel}`;
          return newSelected[subKey];
        });

        if (isAnySubtabChecked) {
          newSelected[parentTab] = { View: true, Create: true, Edit: true, Delete: true };
        } else {
          delete newSelected[parentTab];
        }
      }

      return newSelected;
    });
  };



  const handlePermissionChange = (label, permission, parentTab = null) => {
    const key = parentTab ? `${parentTab}__${label}` : label;

    setSelectedModules((prev) => {
      const updatedPerms = {
        ...prev[key],
        [permission]: !prev[key]?.[permission],
      };

      const newSelected = { ...prev, [key]: updatedPerms };

      const isAnyPermChecked = permissions.some((perm) => updatedPerms[perm]);

      // 1️⃣ Tab without subtabs
      if (!parentTab) {
        const tabItem = sidebar.find(item => item.tab === label);
        const hasSubtabs = tabItem.subtab?.length > 0;

        if (!hasSubtabs) {
          if (isAnyPermChecked) {
            newSelected[label] = updatedPerms;
          } else {
            delete newSelected[label];
          }
        }
      }

      // 2️⃣ Subtab logic
      if (parentTab) {
        if (isAnyPermChecked) {
          newSelected[key] = updatedPerms;
        } else {
          delete newSelected[key];
        }

        // 3️⃣ Tab with subtabs: update tab based on subtabs
        const parentTabItem = sidebar.find(item => item.tab === parentTab);
        const isAnySubtabChecked = parentTabItem.subtab.some(({ label: subLabel }) => {
          const subKey = `${parentTab}__${subLabel}`;
          return permissions.some(p => newSelected[subKey]?.[p]);
        });

        if (isAnySubtabChecked) {
          newSelected[parentTab] = { View: true, Create: true, Edit: true, Delete: true };
        } else {
          delete newSelected[parentTab];
        }
      }

      return newSelected;
    });
  };



  const handleSubmit = async () => {
    if (!roleName.trim()) {
      toast.error("Role name is required!");
      return;
    }

    if (Object.keys(selectedModules).length === 0) {
      toast.error("Please select at least one module!");
      return;
    }

    const tabMap = {};
    Object.entries(selectedModules).forEach(([key, perms]) => {
      if (key.includes('__')) {
        const [tab, subLabel] = key.split('__');
        const parentTabData = sidebar.find(item => item.tab === tab);
        const subTabData = parentTabData?.subtab?.find(s => s.label === subLabel);

        if (!tabMap[tab]) {
          tabMap[tab] = {
            title: tab,
            tabId: parentTabData?.tabId || '',
            icon: parentTabData?.icon || '',
            subTabs: [],
          };
        }

        tabMap[tab].subTabs.push({
          title: subLabel,
          subtabId: subTabData?.subtabId || '',
          permissions: {
            view: perms.View || false,
            create: perms.Create || false,
            edit: perms.Edit || false,
            delete: perms.Delete || false,
          },
        });
      } else {
        const tabItem = sidebar.find(s => s.tab === key);
        const hasSubtabs = tabItem?.subtab?.length > 0;

        if (!tabMap[key]) {
          tabMap[key] = {
            title: key,
            tabId: tabItem?.tabId || '',
            icon: tabItem?.icon || '',
            subTabs: [],
          };
        }

        if (!hasSubtabs) {
          tabMap[key].permissions = {
            view: perms.View || false,
            create: perms.Create || false,
            edit: perms.Edit || false,
            delete: perms.Delete || false,
          };
        }
      }
    });

    const sidebarPayload = {
      role: roleName,
      tabs: Object.values(tabMap),
    };

    try {
      setLoading(true);

      const endpoint = roleData
        ? `/api/update-role/${roleData._id}`  
        : `/api/create-role`;

      const response = await postAPI(endpoint, sidebarPayload, true);

      if (!response.hasError) {
        toast.success(roleData ? 'Sidebar role updated!' : 'Sidebar role created!');
        navigate("/super-admin/settings/user-role");
      } else {
        toast.error('Failed to save sidebar role: ' + (response.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while saving the role.');
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="modal-content" style={{ maxHeight: '90vh' }}>
      <div className="modal-header">
        <h5 className="modal-title" style={{ fontSize: '1.8rem' }}>Create New Role</h5>
      </div>

      <div className="modal-body" style={{ overflowY: 'auto' }}>
        <div className="mb-3">
          <label htmlFor="roleName" className="form-label" style={{ fontSize: '1.4rem' }}>
            Name<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="roleName"
            value={roleName}
            onChange={handleRoleNameChange}
            placeholder="Enter Role Name"
          />
        </div>

        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <thead>
              <tr>
                <th style={{ width: '35%', fontSize: '1.4rem' }}>TABS</th>
                <th style={{ width: '35%', fontSize: '1.4rem' }}>PERMISSIONS</th>
              </tr>
            </thead>
            <tbody>
              {sidebar.map(({ tab, subtab }) => (
                <React.Fragment key={tab}>
                  {/* Top-level tab */}
                  <tr>
                    <td>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={!!selectedModules[tab]}
                          onChange={() => handleModuleToggle(tab)}
                          id={`module-${tab}`}
                        />
                        <label
                          className="form-check-label ms-2 fw-bold font-weight-bold"
                          htmlFor={`module-${tab}`}
                          style={{ fontSize: '1.3rem' }}
                        >
                          {tab}
                        </label>
                      </div>
                    </td>
                    {subtab.length === 0 && (
                      <td style={{ fontSize: '1.1rem' }}>
                        {permissions.map((perm) => (
                          <div className="form-check form-check-inline" key={`${tab}-${perm}`}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedModules[tab]?.[perm]}
                              onChange={() => handlePermissionChange(tab, perm)}
                              id={`perm-${tab}-${perm}`}
                            />
                            <label className="form-check-label" htmlFor={`perm-${tab}-${perm}`}>
                              {perm}
                            </label>
                          </div>
                        ))}
                      </td>
                    )}
                  </tr>

                  {/* Sub-tabs */}
                  {subtab.map(({ label }) => {
                    const key = `${tab}__${label}`;
                    return (
                      <tr key={key} style={{ fontSize: '1.1rem' }}>
                        <td>
                          <div className="form-check" style={{ paddingLeft: '2rem' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={!!selectedModules[key]}
                              onChange={() => handleModuleToggle(label, tab)}
                              id={`module-${key}`}
                            />
                            <label className="form-check-label ms-2" htmlFor={`module-${key}`}>
                              {label}
                            </label>
                          </div>
                        </td>
                        <td>
                          {permissions.map((perm) => (
                            <div className="form-check form-check-inline" key={`${key}-${perm}`}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedModules[key]?.[perm]}
                                onChange={() => handlePermissionChange(label, perm, tab)}
                                id={`perm-${key}-${perm}`}
                              />
                              <label className="form-check-label" htmlFor={`perm-${key}-${perm}`}>
                                {perm}
                              </label>
                            </div>
                          ))}
                        </td>
                      </tr>
                    );
                  })}

                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="btn btn-primary ml-4 mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? (roleData ? 'Updating...' : 'Creating...')
            : (roleData ? 'Update User' : 'Create User')}
        </button>
      </div>

    </div>
  );
};

export default CreateRole;



















// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import postAPI from '../../../../../api/postAPI'

// const permissions = ['View', 'Create', 'Edit', 'Delete'];

// const sidebar = [
//   { tab: 'DashBoard', tabId:'dbd1', icon: 'fa-dashboard', subtab: [] },
//   { tab: 'Admin', tabId:'adn1', icon: 'fas fa-user', subtab: [] },
//   { tab: 'Blogs', tabId:'bgs1', icon: 'fa fa-newspaper', subtab: [] },
//   {
//     tab: 'Artist', tabId:'att1',
//     icon: 'fa fa-paint-brush',
//     subtab: [
//       { label: 'Management', subtabId: 'att11' },
//       { label: 'Blog Request', subtabId: 'att12' },
//       { label: 'Blogs', subtabId: 'att13' },
//       { label: 'Product Request', subtabId: 'att14' },
//       { label: 'Products', subtabId: 'att15' },
//       { label: 'Sold Product', subtabId: 'att16' },
//     ],
//   },
//   {
//     tab: 'Buyer', tabId:'byr1',
//     icon: 'fa-handshake',
//     subtab: [
//       { label: 'Management', subtabId: 'byr11' },
//       { label: 'Product Purchased', subtabId: 'byr12' },
//       { label: 'Resell Product Request', subtabId: 'byr13' },
//       { label: 'Sold Product', subtabId: 'byr14' },
//     ],
//   },
//   {
//     tab: 'Seller', tabId:'slr1',
//     icon: 'fa fa-tag',
//     subtab: [
//       { label: 'Management', subtabId: 'slr11' },
//       { label: 'Products', subtabId: 'slr12' },
//       { label: 'Product Request', subtabId: 'slr13' },
//       { label: 'Sold Product', subtabId: 'slr14' },
//     ],
//   },
//   { tab: 'Product', tabId:'pdt1', icon: 'fa fa-cart-plus', subtab: [] },
//   { tab: 'Custom Order', tabId:'cor1', icon: 'fa fa-cart-plus', subtab: [] },
//   { tab: 'Product Purchased', tabId:'ptp1', icon: 'fa fa-cart-plus', subtab: [] },
//   {
//     tab: 'Bidding', tabId:'bdg1',
//     icon: 'fa fa-gavel',
//     subtab: [
//       { label: 'All Products', subtabId: 'bdg11' },
//       { label: 'Bidded Product', subtabId: 'bdg12' },
//       { label: 'Bidding Pass', subtabId: 'bdg13' },
//     ],
//   },
//   { tab: 'Certification Services', tabId:'csv1', icon: 'fa fa-certificate', subtab: [] },
//   { tab: 'Sponsor', tabId:'spr1', icon: 'fa fa-bullhorn', subtab: [] },
//   {
//     tab: 'Settings', tabId:'stg1',
//     icon: 'fa fa-cog',
//     subtab: [
//       { label: 'Product Category', subtabId: 'stg11' },
//       { label: 'Blog Category', subtabId: 'stg12' },
//       { label: 'Email Setting', subtabId: 'stg13' },
//       { label: 'Marketing', subtabId: 'stg14' },
//       { label: 'User Role', subtabId: 'stg15' },
//     ],
//   },

// ];

// const CreateRole = () => {
//   const [roleName, setRoleName] = useState('');
//   const [selectedModules, setSelectedModules] = useState({});
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();


//   const handleRoleNameChange = (e) => setRoleName(e.target.value);


//   const handleModuleToggle = (label, parentTab = null) => {
//     setSelectedModules((prev) => {
//       const newSelected = { ...prev };
//       const key = parentTab ? `${parentTab}__${label}` : label;
//       const isChecked = !!newSelected[key];

//       if (isChecked) {
//         delete newSelected[key];
//       } else {
//         newSelected[key] = {
//           View: true,
//           Create: true,
//           Edit: true,
//           Delete: true
//         };
//       }

//       if (!parentTab) {
//         const foundTab = sidebar.find(item => item.tab === label);
//         if (foundTab?.subtab?.length > 0) {
//           foundTab.subtab.forEach(({ label: subLabel }) => {
//             const subKey = `${label}__${subLabel}`;
//             if (isChecked) {
//               delete newSelected[subKey];
//             } else {
//               newSelected[subKey] = {
//                 View: true,
//                 Create: true,
//                 Edit: true,
//                 Delete: true
//               };
//             }
//           });
//         }
//       }

//       if (parentTab) {
//         const parentTabItem = sidebar.find((item) => item.tab === parentTab);
//         const isAnySubtabChecked = parentTabItem.subtab.some(({ label: subLabel }) => {
//           const subKey = `${parentTab}__${subLabel}`;
//           return newSelected[subKey];
//         });

//         if (isAnySubtabChecked) {
//           newSelected[parentTab] = { View: true, Create: true, Edit: true, Delete: true };
//         } else {
//           delete newSelected[parentTab];
//         }
//       }

//       return newSelected;
//     });
//   };



//   const handlePermissionChange = (label, permission, parentTab = null) => {
//     const key = parentTab ? `${parentTab}__${label}` : label;

//     setSelectedModules((prev) => {
//       const updatedPerms = {
//         ...prev[key],
//         [permission]: !prev[key]?.[permission],
//       };

//       const newSelected = { ...prev, [key]: updatedPerms };

//       const isAnyPermChecked = permissions.some((perm) => updatedPerms[perm]);

//       // 1️⃣ Tab without subtabs
//       if (!parentTab) {
//         const tabItem = sidebar.find(item => item.tab === label);
//         const hasSubtabs = tabItem.subtab?.length > 0;

//         if (!hasSubtabs) {
//           if (isAnyPermChecked) {
//             newSelected[label] = updatedPerms;
//           } else {
//             delete newSelected[label];
//           }
//         }
//       }

//       // 2️⃣ Subtab logic
//       if (parentTab) {
//         if (isAnyPermChecked) {
//           newSelected[key] = updatedPerms;
//         } else {
//           delete newSelected[key];
//         }

//         // 3️⃣ Tab with subtabs: update tab based on subtabs
//         const parentTabItem = sidebar.find(item => item.tab === parentTab);
//         const isAnySubtabChecked = parentTabItem.subtab.some(({ label: subLabel }) => {
//           const subKey = `${parentTab}__${subLabel}`;
//           return permissions.some(p => newSelected[subKey]?.[p]);
//         });

//         if (isAnySubtabChecked) {
//           newSelected[parentTab] = { View: true, Create: true, Edit: true, Delete: true };
//         } else {
//           delete newSelected[parentTab];
//         }
//       }

//       return newSelected;
//     });
//   };



//   const handleSubmit = async () => {
//   if (!roleName.trim()) {
//     toast.error("Role name is required!");
//     return;
//   }

//   if (Object.keys(selectedModules).length === 0) {
//     toast.error("Please select at least one module!");
//     return;
//   }

//   const tabMap = {};

//   Object.entries(selectedModules).forEach(([key, perms]) => {
//     if (key.includes('__')) {
//       const [tab, subLabel] = key.split('__');
//       const parentTabData = sidebar.find(item => item.tab === tab);
//       const subTabData = parentTabData?.subtab?.find(s => s.label === subLabel);

//       if (!tabMap[tab]) {
//         tabMap[tab] = {
//           title: tab,
//           tabId: parentTabData?.tabId || '',
//           icon: parentTabData?.icon || '',
//           subTabs: [],
//         };
//       }

//       tabMap[tab].subTabs.push({
//         title: subLabel,
//         subtabId: subTabData?.subtabId || '',
//         permissions: {
//           view: perms.View || false,
//           create: perms.Create || false,
//           edit: perms.Edit || false,
//           delete: perms.Delete || false,
//         },
//       });

//     } else {
//       const tabItem = sidebar.find(s => s.tab === key);
//       const hasSubtabs = tabItem?.subtab?.length > 0;

//       if (!tabMap[key]) {
//         tabMap[key] = {
//           title: key,
//           tabId: tabItem?.tabId || '',
//           icon: tabItem?.icon || '',
//           subTabs: [],
//         };
//       }

//       if (!hasSubtabs) {
//         tabMap[key].permissions = {
//           view: perms.View || false,
//           create: perms.Create || false,
//           edit: perms.Edit || false,
//           delete: perms.Delete || false,
//         };
//       }
//     }
//   });

//   const sidebarPayload = {
//     role: roleName,
//     tabs: Object.values(tabMap),
//   };

//   try {
//     setLoading(true);
//     const response = await postAPI("/api/create-role", sidebarPayload, true);

//     if (!response.hasError) {
//       toast.success('Sidebar role created successfully!');
//       navigate("/super-admin/settings/user-role");
//     } else {
//       toast.error('Failed to create sidebar role: ' + (response.message || 'Unknown error'));
//     }
//   } catch (err) {
//     console.error('Error:', err);
//     toast.error('An error occurred while creating the role.');
//   } finally {
//     setLoading(false);
//   }
// };



//   return (
//     <div className="modal-content" style={{ maxHeight: '90vh' }}>
//       <div className="modal-header">
//         <h5 className="modal-title" style={{ fontSize: '1.8rem' }}>Create New Role</h5>
//       </div>

//       <div className="modal-body" style={{ overflowY: 'auto' }}>
//         <div className="mb-3">
//           <label htmlFor="roleName" className="form-label" style={{ fontSize: '1.4rem' }}>
//             Name<span className="text-danger">*</span>
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="roleName"
//             value={roleName}
//             onChange={handleRoleNameChange}
//             placeholder="Enter Role Name"
//           />
//         </div>

//         <div className="table-responsive">
//           <table className="table table-borderless mb-0">
//             <thead>
//               <tr>
//                 <th style={{ width: '35%', fontSize: '1.4rem' }}>TABS</th>
//                 <th style={{ width: '35%', fontSize: '1.4rem' }}>PERMISSIONS</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sidebar.map(({ tab, subtab }) => (
//                 <React.Fragment key={tab}>
//                   {/* Top-level tab */}
//                   <tr>
//                     <td>
//                       <div className="form-check">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           checked={!!selectedModules[tab]}
//                           onChange={() => handleModuleToggle(tab)}
//                           id={`module-${tab}`}
//                         />
//                         <label
//                           className="form-check-label ms-2 fw-bold font-weight-bold"
//                           htmlFor={`module-${tab}`}
//                           style={{ fontSize: '1.3rem' }}
//                         >
//                           {tab}
//                         </label>
//                       </div>
//                     </td>
//                     {subtab.length === 0 && (
//                       <td style={{ fontSize: '1.1rem' }}>
//                         {permissions.map((perm) => (
//                           <div className="form-check form-check-inline" key={`${tab}-${perm}`}>
//                             <input
//                               className="form-check-input"
//                               type="checkbox"
//                               checked={selectedModules[tab]?.[perm]}
//                               onChange={() => handlePermissionChange(tab, perm)}
//                               id={`perm-${tab}-${perm}`}
//                             />
//                             <label className="form-check-label" htmlFor={`perm-${tab}-${perm}`}>
//                               {perm}
//                             </label>
//                           </div>
//                         ))}
//                       </td>
//                     )}
//                   </tr>

//                   {/* Sub-tabs */}
//                   {subtab.map(({ label }) => {
//                     const key = `${tab}__${label}`;
//                     return (
//                       <tr key={key} style={{ fontSize: '1.1rem' }}>
//                         <td>
//                           <div className="form-check" style={{ paddingLeft: '2rem' }}>
//                             <input
//                               className="form-check-input"
//                               type="checkbox"
//                               checked={!!selectedModules[key]}
//                               onChange={() => handleModuleToggle(label, tab)}
//                               id={`module-${key}`}
//                             />
//                             <label className="form-check-label ms-2" htmlFor={`module-${key}`}>
//                               {label}
//                             </label>
//                           </div>
//                         </td>
//                         <td>
//                           {permissions.map((perm) => (
//                             <div className="form-check form-check-inline" key={`${key}-${perm}`}>
//                               <input
//                                 className="form-check-input"
//                                 type="checkbox"
//                                 checked={selectedModules[key]?.[perm]}
//                                 onChange={() => handlePermissionChange(label, perm, tab)}
//                                 id={`perm-${key}-${perm}`}
//                               />
//                               <label className="form-check-label" htmlFor={`perm-${key}-${perm}`}>
//                                 {perm}
//                               </label>
//                             </div>
//                           ))}
//                         </td>
//                       </tr>
//                     );
//                   })}

//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <button className="btn btn-primary ml-4 mt-4"
//         onClick={handleSubmit}
//         disabled={loading}
//         >
//           {loading ? 'Creating...' : 'Create User'}
//         </button>
//       </div>

//     </div>
//   );
// };

// export default CreateRole;
