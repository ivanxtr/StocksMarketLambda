module.exports.test = () => {
  return {
    body: JSON.stringify(
      {
        test: "aqui test",
      },
      null,
      2,
    )
  }
}
