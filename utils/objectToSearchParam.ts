export function objectToSearch(object: { [name: string]: any }) {
  const keys = Object.keys(object);
  const values = Object.values(object);
  let search: string = '?';

  keys.forEach((item, index) => {
    if (
      item &&
      (values[index] ||
        values[index] === 0 ||
        values[index] === false ||
        values[index] === true) &&
      (values[index].length > 0 ||
        typeof values[index] === 'number' ||
        typeof values[index] === 'boolean')
    ) {
      search += `${item}=${
        typeof values[index] === 'object'
          ? `[${
              typeof values[index][0] === 'number'
                ? values[index]
                : values[index].map((i: string) => {
                    return '"' + i + '"';
                  })
            }]`
          : values[index]
      }&`;
    }
  });

  return search;
}
