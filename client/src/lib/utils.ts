export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    backgroundColor: isDarkMode
      ? "var(--color-dark-secondary)"
      : "var(--color-white)",

    "& .MuiDataGrid-columnHeaders": {
      color: isDarkMode ? "var(--color-gray-200)" : "var(--color-gray-700)",
      '& [role="row"] > *': {
        backgroundColor: isDarkMode
          ? "var(--color-stroke-dark)"
          : "var(--color-gray-100)",
      },
    },

    "& .MuiIconButton-root": {
      color: isDarkMode ? "var(--color-gray-500)" : "var(--color-gray-700)",
    },

    "& .MuiTablePagination-root": {
      color: isDarkMode ? "var(--color-gray-500)" : "var(--color-gray-700)",
    },

    "& .MuiTablePagination-selectIcon": {
      color: isDarkMode ? "var(--color-gray-500)" : "var(--color-gray-700)",
    },

    "& .MuiDataGrid-cell": {
      color: isDarkMode ? "var(--color-gray-200)" : "var(--color-gray-800)",
      border: "none",
    },

    "& .MuiDataGrid-row": {
      borderBottom: `  ${
        isDarkMode ? "var(--color-stroke-dark)" : "var(--color-gray-200)"
      }`,
      backgroundColor: isDarkMode
        ? "var(--color-dark-secondary)"
        : "var(--color-white)",
      "&:hover": {
        backgroundColor: isDarkMode
          ? "var(--color-dark-tertiary)"
          : "var(--color-gray-100)",
      },
      "&.Mui-selected": {
        backgroundColor: isDarkMode
          ? "var(--color-blue-400)"
          : "var(--color-blue-200)",
      },
    },

    "& .MuiDataGrid-withBorderColor": {
      borderColor: isDarkMode
        ? "var(--color-stroke-dark)"
        : "var(--color-gray-200)",
    },
  };
};
