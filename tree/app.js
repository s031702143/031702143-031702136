const rootKey = "导师";
const childKeys = ["级博士生", "级硕士生", "级本科生"];
const stageKey = "级";
const separatorForPerson = "、"; // 中文顿号
const separatorForDegree = "："; // 中文分号

function extractData(inputData) {
  const treesRawList = [];
  const infoList = inputData
    .trim()
    .split("\n")
    .map(function(v) {
      return v.trim();
    });

  let treeInfo = [];
  infoList.forEach(function(v, i) {
    if (v === "") {
      if (treeInfo.length !== 0) {
        treesRawList.push(treeInfo);
      }
      treeInfo = [];
      return;
    }
    if (i === infoList.length - 1 && treeInfo.length !== 0) {
      treesRawList.push(treeInfo);
    }
    treeInfo.push(v);
  });

  return treesRawList;
}

function parseTreeData(infoList) {
  let teacherInfo,
    doctorInfoList = [],
    masterInfoList = [],
    bachelorInfoList = [];

  infoList.forEach(function(v) {
    if (v.includes(rootKey)) {
      teacherInfo = v;
    }
    if (v.includes(childKeys[0])) {
      doctorInfoList.push(v);
    }
    if (v.includes(childKeys[1])) {
      masterInfoList.push(v);
    }
    if (v.includes(childKeys[2])) {
      bachelorInfoList.push(v);
    }
  });

  const teacherName = teacherInfo.split(separatorForDegree)[1];
  const doctorNameList = extractMembers(doctorInfoList);
  const masterNameList = extractMembers(masterInfoList);
  const bachelorNameList = extractMembers(bachelorInfoList);

  const stageSet = {};
  Object.keys(doctorNameList).forEach(function(v) {
    stageSet[v] = v;
  });
  Object.keys(masterNameList).forEach(function(v) {
    stageSet[v] = v;
  });
  Object.keys(bachelorNameList).forEach(function(v) {
    stageSet[v] = v;
  });

  const children = [];
  Object.keys(stageSet).forEach(function(v) {
    const students = [];
    if (doctorNameList[v]) {
      students.push({
        name: "博士生",
        children: doctorNameList[v].map(function(v) {
          return {
            name: v
          };
        })
      });
    }
    if (masterNameList[v]) {
      students.push({
        name: "硕士生",
        children: masterNameList[v].map(function(v) {
          return {
            name: v
          };
        })
      });
    }
    if (bachelorNameList[v]) {
      students.push({
        name: "本科生",
        children: bachelorNameList[v].map(function(v) {
          return {
            name: v
          };
        })
      });
    }
    children.push({
      name: v,
      children: students
    });
  });

  return {
    name: teacherName,
    children: children
  };
}

function extractMembers(infoList) {
  const info = {};

  infoList.forEach(function(v) {
    const stage = v.split(stageKey)[0];
    if (!info[stage]) {
      info[stage] = [];
    }
    const members = v.split(separatorForDegree)[1].split(separatorForPerson);
    members.forEach(function(v) {
      info[stage].push(v);
    });
  });

  return info;
}

console.info(
  extractData(
    `
    导师：张三
    2016级博士生：天一、王二、吴五
    2015级硕士生：李四、王五、许六
    2016级硕士生：刘一、李二、李三
    2017级本科生：刘六、琪七、司四


    导师：张三
    2016级博士生：天一、王二、吴五
    2015级硕士生：李四、王五、许六
    2016级硕士生：刘一、李二、李三
    2017级本科生：刘六、琪七、司四
    `
  )
);
