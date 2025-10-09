const UpdateUserPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return <div>{JSON.stringify(params)}</div>;
};

export default UpdateUserPage;
