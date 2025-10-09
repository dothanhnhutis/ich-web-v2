import React from "react";

const UpdateRolePage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  return <div>{id}</div>;
};

export default UpdateRolePage;
